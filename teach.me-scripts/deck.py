import base64
from PIL import Image
import io
import fitz
import anthropic
import os
import re
from tqdm import tqdm

client = anthropic.Anthropic()
MODEL_NAME = "claude-3-opus-20240229"


# Define the function to convert a pdf slide deck to a list of images. Note that we need to ensure we resize images to keep them within Claude's size limits.
def pdf_to_base64_pngs(pdf_path, path_name, quality=75, max_size=(1024, 1024)):
    # Open the PDF file
    doc = fitz.open(pdf_path)

    # Iterate through each page of the PDF
    for page_num in range(doc.page_count):
        # Load the page
        page = doc.load_page(page_num)

        # Render the page as a PNG image
        pix = page.get_pixmap(matrix=fitz.Matrix(300 / 72, 300 / 72))

        # Save the PNG image
        if os.path.exists(f"pngs/{path_name}/slides") is False:
            print("here \n")
            os.mkdir(f"pngs/{path_name}")
            os.mkdir(f"pngs/{path_name}/slides")
        output_path = f"pngs/{path_name}/slides/page_{page_num+1}.png"
        pix.save(output_path)

    # Convert the PNG images to base64 encoded strings
    images = [
        Image.open(f"pngs/{path_name}/slides/page_{page_num+1}.png")
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
def get_completion(messages):
    response = client.messages.create(
        model=MODEL_NAME, max_tokens=1024, temperature=0, messages=messages
    )
    return response.content[0].text


# Define two functions that allow us to craft prompts for narrating our slide deck. We would adjut these prompts based on the nature of the deck, but keep the structure largely the same.
def build_previous_slides_prompt(previous_slide_narratives):
    prompt = "\n".join(
        [
            f"<slide_narration id={index+1}>\n{narrative}\n</slide_narration>"
            for index, narrative in enumerate(previous_slide_narratives)
        ]
    )
    return prompt


def build_slides_narration_prompt(previous_slide_narratives):
    if len(previous_slide_narratives) == 0:
        prompt = """You are professor giving a lecture on this presentation. You are currently on slide 1. Keep it short. Can you make this 50 words or less. Put your lecture in <lecture> tags."""

    else:
        prompt = f"""You are professor giving a lecture on this presentation. You said this in your previous slides: 
              <previous_slide_narrations>
              {build_previous_slides_prompt(previous_slide_narratives)}
              </previous_slide_narrations>
            You are currently on slide {len(previous_slide_narratives)+1}. Keep your presentation short. Can you make this 50 words or less.
            Put your lecture in <lecture> tags."""

    return prompt


def main():

    pdf_path = "pdfs/lecture_test.pdf"  # This is the path to our slide deck.
    pdf_path_split = pdf_path.split("/")
    # print(pdf_path_split)
    encoded_pngs = pdf_to_base64_pngs(pdf_path, pdf_path_split[1])

    # Now let's pass the first 20 of these images (in order) to Claude at once and ask it a question about the deck. Why 20? Currently, the Anthropic API only allows you to pass in a maximum of 20 images. While this number will likely increase over time, we have some helpful tips for how to manage it later in this recipe.
    previous_slide_narratives = []
    f = open("transcripts/lecture_test.txt", "w")
    f.write("Now the file has more content!")
    early_break = 0

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
                        "text": build_slides_narration_prompt(
                            previous_slide_narratives
                        ),
                    },
                ],
            }
        ]
        completion = get_completion(messages)

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

    slide_narration = build_previous_slides_prompt(previous_slide_narratives)
    f.close()


# print(get_completion(messages))

if __name__ == "__main__":
    main()
