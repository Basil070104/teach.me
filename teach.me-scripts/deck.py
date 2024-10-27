import base64
from PIL import Image
import io
import fitz
import anthropic
import os
import re
from tqdm import tqdm
import gtts
import requests
import firebase_admin
from firebase_admin import credentials, storage, db
import time
import uuid


MODEL_NAME = "claude-3-opus-20240229"
global_id_value = None


class Deck:
    def __init__(self, model, pdf_path, id_value=None):
        global global_id_value
        self.client = anthropic.Anthropic()
        self.model = model
        self.pdf_path = pdf_path
        # self.path_name = pdf_path.split("/")[1]
        self.path_name = "lecture"
        self.id_value = id_value
        global_id_value = id_value

        # if not firebase_admin._apps:
        cred = credentials.Certificate("../teach.me-env/serviceAccountKey.json")
        firebase_admin.initialize_app(
            cred,
            {
                "databaseURL": "https://teachme-d2815-default-rtdb.firebaseio.com/",
                "storageBucket": "teachme-d2815.appspot.com",
            },
        )
        self.bucket = storage.bucket()
        # self.bucket_name = "teachme-d2815.appspot.com"
        # self.storage_client = storage.Client()
        # self.bucket = self.storage_client.bucket(self.bucket_name)

    def store_id(self):
        if self.id_value:
            # Logic to store the ID, e.g., save it to a database or log it
            print(f"Storing ID: {self.id_value}")  # For demonstration
            # You could also save it to Firebase or any other storage solution
        else:
            print("No ID provided to store.")

    def download_pdf(self):
        """Download PDF from URL and return as bytes"""
        response = requests.get(self.pdf_path)
        if response.status_code != 200:
            raise Exception(
                f"Failed to download PDF. Status code: {response.status_code}"
            )
        return response.content

    # Define the function to convert a pdf slide deck to a list of images. Note that we need to ensure we resize images to keep them within Claude's size limits.
    def pdf_to_base64_pngs(self, quality=75, max_size=(1024, 1024)):
        # Download the PDF content
        pdf_content = self.download_pdf()

        # Create a temporary buffer for the PDF content
        pdf_buffer = io.BytesIO(pdf_content)

        # Open the PDF from the buffer
        doc = fitz.open(stream=pdf_buffer, filetype="pdf")

        # Iterate through each page of the PDF
        for page_num in range(doc.page_count):
            # Load the page
            page = doc.load_page(page_num)

            # Render the page as a PNG image
            pix = page.get_pixmap(matrix=fitz.Matrix(300 / 72, 300 / 72))

            # Save the PNG image
            if os.path.exists(f"pngs/{self.path_name}/slides") is False:
                print("here \n")
                os.mkdir(f"pngs/{self.path_name}")
                os.mkdir(f"pngs/{self.path_name}/slides")
            output_path = f"pngs/{self.path_name}/slides/page_{page_num+1}.png"
            pix.save(output_path)

        # Convert the PNG images to base64 encoded strings
        images = [
            Image.open(f"pngs/{self.path_name}/slides/page_{page_num+1}.png")
            for page_num in range(doc.page_count)
        ]
        # Close the PDF document
        doc.close()

        base64_encoded_pngs = []

        for image in images:
            # Resize the image if it exceeds the maximum size
            if image.size[0] > max_size[0] or image.size[1] > max_size[1]:
                image.thumbnail(max_size, Image.Resampling.LANCZOS)
            image_data = io.BytesIO()
            image.save(image_data, format="PNG", optimize=True, quality=quality)
            image_data.seek(0)
            base64_encoded = base64.b64encode(image_data.getvalue()).decode("utf-8")
            base64_encoded_pngs.append(base64_encoded)

        return base64_encoded_pngs

    # Make a useful helper function.
    def get_completion(self, messages):
        response = self.client.messages.create(
            model=MODEL_NAME, max_tokens=1024, temperature=0, messages=messages
        )
        return response.content[0].text

    # Define two functions that allow us to craft prompts for narrating our slide deck. We would adjut these prompts based on the nature of the deck, but keep the structure largely the same.
    def build_previous_slides_prompt(self, previous_slide_narratives):
        prompt = "\n".join(
            [
                f"<slide_narration id={index+1}>\n{narrative}\n</slide_narration>"
                for index, narrative in enumerate(previous_slide_narratives)
            ]
        )
        return prompt

    def build_slides_narration_prompt(self, previous_slide_narratives):
        if len(previous_slide_narratives) == 0:
            prompt = """You are professor giving a lecture on this presentation. You are currently on slide 1. Keep it short. Can you make this 50 words or less. Put your lecture in <lecture> tags."""

        else:
            prompt = f"""You are professor giving a lecture on this presentation. You said this in your previous slides: 
                <previous_slide_narrations>
                {self.build_previous_slides_prompt(previous_slide_narratives)}
                </previous_slide_narrations>
                You are currently on slide {len(previous_slide_narratives)+1}. Keep your presentation short. Can you make this 50 words or less.
                Put your lecture in <lecture> tags."""

        return prompt

    def transcript_to_video(self, path, narration):
        # The text that you want to convert to audio
        f = open(path, "r")
        mytext = narration
        # print(mytext)

        # Language ind which you want to convert
        language = "en"

        # Passing the text and language to the engine,
        # here we have marked slow=False. Which tells
        # the module that the converted audio should
        # have a high speed
        myobj = gtts.gTTS(text=mytext, lang=language, slow=False)

        # Saving the converted audio in a mp3 file named
        # welcome
        myobj.save("audio/lecture.mp3")

        return myobj

    # Playing the converted file
    # os.system("audio/lecture.mp3")

    def upload_audio_to_firebase(self, audio_file_path):
        # Use the global_id_value as the unique identifier
        unique_id = global_id_value

        # Define the blob for the audio file
        audio_blob = self.bucket.blob(
            f"audio/{unique_id}_{os.path.basename(audio_file_path)}"
        )
        audio_blob.upload_from_filename(audio_file_path)

        audio_blob.make_public()
        audio_url = audio_blob.public_url

        # Get the public URL for the uploaded audio file
        if not audio_url:
            # Create the URL manually
            token = audio_blob.metadata.get("firebaseStorageDownloadTokens", "")
            audio_url = f"https://firebasestorage.googleapis.com/v0/b/{self.bucket.name}/o/{audio_blob.name}?alt=media&token={token}"
            # Return the unique ID and audio URL

        return unique_id, audio_url

    def update_audio_metadata(self, audio_url):
        # Use the global_id_value to update the metadata in Realtime Database
        ref = db.reference(f"uploads/{global_id_value}")
        ref.update(
            {
                "audioUrl": audio_url,  # Update with the audio URL
                "updatedAt": str(int(time.time())),  # Optionally update the timestamp
            }
        )

    # def run(self):
    def run(self):
        print("------ Received Call from Server ------")

        # Convert PDF to base64 PNGs
        encoded_pngs = self.pdf_to_base64_pngs()

        previous_slide_narratives = []
        f = open("transcripts/lecture_test.txt", "w")

        for i, encoded_png in tqdm(enumerate(encoded_pngs)):
            messages = [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": "image/png",
                                "data": encoded_png,
                            },
                        },
                        {
                            "type": "text",
                            "text": self.build_slides_narration_prompt(
                                previous_slide_narratives
                            ),
                        },
                    ],
                }
            ]
            completion = self.get_completion(messages)

            pattern = r"<lecture>(.*?)</lecture>"
            match = re.search(pattern, completion.strip(), re.DOTALL)
            if match:
                narration = match.group(1)
            else:
                raise ValueError("No lecture available.")

            previous_slide_narratives.append(narration)
            f.write(narration)
            # If you want to see the narration we produced, uncomment the below line
            # print(narration)
            early_break += 1
            if early_break == 5:
                break

        # Close the transcript file
        f.close()

        # Combine previous slide narrations into a single string for audio generation
        slide_narration = self.build_previous_slides_prompt(previous_slide_narratives)

        # Generate audio from the narration
        audio_path = "audio/lecture.mp3"
        self.transcript_to_video(audio_path, slide_narration)

        # Upload audio to Firebase and get the unique ID and URL
        unique_id, audio_url = self.upload_audio_to_firebase(audio_path)
        print(f"Audio uploaded to Firebase: {audio_url}")

        # Update audio metadata in Realtime Database
        self.update_audio_metadata(audio_url)

        return True, audio_url


# print(get_completion(messages))

if __name__ == "__main__":
    object = Deck(MODEL_NAME, "pdfs/lecture_test.pdf")
    object.run()
