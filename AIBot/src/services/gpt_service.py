import openai
import os

from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("OPEN_AI_KEY")


class GptService:
    def __init__(self):
        pass

    def generate_text_based_on_topic(self, topic, text, theme):
        prompt = f"Based on this text excerpt called '{topic}':\n  {text}.\n\nGenerate a new one, following a similar text pattern, but about the theme of '{theme}'"
        COMPLETIONS_MODEL = "text-davinci-003"

        openai.api_key = API_KEY

        response = openai.Completion.create(
            prompt=prompt,
            temperature=0.7,
            max_tokens=300,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0,
            model=COMPLETIONS_MODEL
        )
        print(response["choices"][0]["text"].strip(" \n"), flush=True)
        return {'generatedText' : response["choices"][0]["text"].strip(" \n")}
    

