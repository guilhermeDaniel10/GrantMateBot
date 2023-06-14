import string
import json


import nltk
from nltk.corpus import stopwords
from nltk.stem import SnowballStemmer
from nltk.tokenize import word_tokenize
from ai_model_management.language_service import LanguageService



class DeprecatedDataTreatmentService:
    def __init__(self):
        nltk.download('stopwords')
        nltk.download('punkt')

    def pre_process(self, text, filename):
        self.text = text.lower()
        self.filename = filename

        language_service = LanguageService()
        language = language_service.detect_language(self.text, max_chars=1000)

        print("LINGUAGEM " + language, flush=True)

        self.stopwords = set(stopwords.words(language))
        self.stemmer = SnowballStemmer(language)

        # Tokenize text
        tokens = word_tokenize(self.text)

        # Remove punctuation and non-alphabetic characters
        tokens = [token for token in tokens if token.isalpha()]

        # Remove stopwords
        tokens = [token for token in tokens if token not in self.stopwords]

        # Stem words - puts words in a simple form
        tokens = [self.stemmer.stem(token) for token in tokens]

        # Lowercase words
        tokens = [token.lower() for token in tokens]

        # Join tokens back into a single string
        processed_text = ' '.join(tokens)

        return processed_text

    def prepare_data_to_jsonl(self, processed_text):
        # Format data as JSON Lines
        data = {"text": processed_text.strip(), "meta": {"id": self.filename}}
        json_lines = json.dumps(data)

        return json_lines
