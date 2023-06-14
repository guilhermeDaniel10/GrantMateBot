import spacy
from spacy.lang.en.stop_words import STOP_WORDS
from string import punctuation
from heapq import nlargest
from transformers import pipeline
from transformers import AutoModelForSeq2SeqLM
from transformers import AutoTokenizer
import json
import requests

model_id = "facebook/bart-large-cnn"
hf_token = "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"

FILE_STORAGE_PATH_PYTHON = "/usr/aibot/file-storage/"

api_url = f"https://api-inference.huggingface.co/models/{model_id}"
headers = {"Authorization": f"Bearer {hf_token}"}


class SummarizeService:
    # empty constructor
    def __init__(self):

        #self.summarizer = pipeline(
        #    "summarization", model="facebook/bart-large-cnn")
        pass

    def summarize(self, text, per):
        nlp = spacy.load('en_core_web_lg')
        doc = nlp(text)
        tokens = [token.text for token in doc]
        print(tokens, flush=True)
        word_frequencies = {}
        for word in doc:
            if word.text.lower() not in list(STOP_WORDS):
                if word.text.lower() not in punctuation:
                    if word.text not in word_frequencies.keys():
                        word_frequencies[word.text] = 1
                    else:
                        word_frequencies[word.text] += 1
        max_frequency = max(word_frequencies.values())
        for word in word_frequencies.keys():
            word_frequencies[word] = word_frequencies[word]/max_frequency
        sentence_tokens = [sent for sent in doc.sents]
        sentence_scores = {}
        for sent in sentence_tokens:
            for word in sent:
                if word.text.lower() in word_frequencies.keys():
                    if sent not in sentence_scores.keys():
                        sentence_scores[sent] = word_frequencies[word.text.lower()]
                    else:
                        sentence_scores[sent] += word_frequencies[word.text.lower()]
        select_length = int(len(sentence_tokens)*per)
        summary = nlargest(select_length, sentence_scores,
                           key=sentence_scores.get)
        final_summary = [word.text for word in summary]
        summary = ''.join(final_summary)

        print(summary, flush=True)
        return summary

    def summarize_transformers(self, text, min_length=30, max_length=100):
        payload = {"inputs": text, "parameters": {
            "min_length": min_length, "max_length": max_length, "do_sample": False}}
        data = json.dumps(payload)
        response = requests.request(
            "POST", api_url, headers=headers, data=data)
        return json.loads(response.content.decode("utf-8"))

        # summary = self.summarizer(
        #    text, max_length=max_length, min_length=min_length, do_sample=False)

        # summary_to_json = {
        #    "summary_text": summary[0]['summary_text']
        # }

        summary_to_json = {
            "summary_text": summary
        }
        return summary_to_json
