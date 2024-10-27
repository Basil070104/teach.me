import os
import google.generativeai as genai


class Gem:

    def __init__(self):
        genai.configure(api_key=os.environ["GEMINI_API_KEY"])

    def run(self, data):

        # Create the model
        generation_config = {
            "temperature": 1,
            "top_p": 0.95,
            "top_k": 64,
            "max_output_tokens": 8192,
            "response_mime_type": "text/plain",
        }

        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config=generation_config,
        )

        chat_session = model.start_chat(
            history=[
                {
                    "role": "user",
                    "parts": [
                        "give more information on a topic by linking urls based on some information",
                    ],
                },
                {
                    "role": "model",
                    "parts": [
                        'Please provide me with the topic and any relevant information you have, and I\'ll do my best to find relevant URLs to provide more information. For example, you could tell me:\n\n* **The topic:** "The history of the internet" \n* **Relevant information:** "I\'m interested in learning about the early development of the internet, specifically the role of the ARPANET."\n\nWith that information, I can then search for and link to relevant resources like:\n\n* **Wikipedia articles:** [https://en.wikipedia.org/wiki/History_of_the_Internet](https://en.wikipedia.org/wiki/History_of_the_Internet)\n* **Articles from academic journals:** [https://www.tandfonline.com/toc/tmst20/current](https://www.tandfonline.com/toc/tmst20/current)\n* **Websites of relevant organizations:** [https://www.internetsociety.org/](https://www.internetsociety.org/)\n* **Online documentaries:** [https://www.youtube.com/watch?v=v2Q_k_hM2d8](https://www.youtube.com/watch?v=v2Q_k_hM2d8)\n\nThe more information you give me, the better I can tailor my search and find the most helpful resources. \n',
                    ],
                },
            ]
        )

        response = chat_session.send_message(data)

        print(response.text)
