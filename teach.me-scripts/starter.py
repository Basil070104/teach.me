import anthropic
import base64
import httpx
from IPython.display import Image

client = anthropic.Anthropic()

message = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1000,
    temperature=0,
    system="Pretend you are the host of Talk Tuah",
    messages=[
        {
            "role": "user",
            "content": [{"type": "text", "text": "How to deal with men"}],
        }
    ],
)
# print(message.content)

content = message.content
print(content[0].text)
print("\n")

image1_url = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
image1_media_type = "image/jpeg"
image1_data = base64.b64encode(httpx.get(image1_url).content).decode("utf-8")

image2_url = "https://upload.wikimedia.org/wikipedia/commons/b/b5/Iridescent.green.sweat.bee1.jpg"
image2_media_type = "image/jpeg"
image2_data = base64.b64encode(httpx.get(image2_url).content).decode("utf-8")

image3 = Image(filename="photos/statship_landing.png")

with open("photos/starship_landing.png", "rb") as image_file:
    binary_data = image_file.read()
    base_64_encoded_data = base64.b64encode(binary_data)
    base64_string = base_64_encoded_data.decode("utf-8")

message_list = [
    {
        "role": "user",
        "content": [
            {
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": "image/jpeg",
                    "data": base64_string,
                },
            },
            {"type": "text", "text": "Write an allegory of this image"},
        ],
    }
]

client.messages.create(
    model="claude-3-sonnet-20240229", max_tokens=1024, messages=message_list
)


# message = client.messages.create(
#     model="claude-3-5-sonnet-20241022",
#     max_tokens=1024,
#     messages=[
#         {
#             "role": "user",
#             "content": [
#                 {
#                     "type": "image",
#                     "source": {
#                         "type": "base64",
#                         "media_type": image1_media_type,
#                         "data": image1_data,
#                     },
#                 },
#                 {"type": "text", "text": "Describe this image."},
#             ],
#         }
#     ],
# )
print(message.content[0].text)
