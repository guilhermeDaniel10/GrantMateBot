from langdetect import detect
from iso639 import languages


class LanguageService:
    #empty constructor
    def __init__(self):
        pass

    def detect_language(self, text, max_chars=None):
        if max_chars is not None:
            text = text[:max_chars]
        try:
            lang_code = detect(text)
            lang_name = languages.get(alpha2=lang_code).name
            return lang_name.lower()
        except:
            return None
