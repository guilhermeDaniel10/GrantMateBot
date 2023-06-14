

from services.language_service import LanguageService
from dto.response_dto import ResponseDTO


class LanguageController:
    def __init__(self):
        self.language_service = LanguageService()

    def detect_language_by_request(self, request_data, limit):
        try:
            text = request_data['text']
            language = self.language_service.detect_language(text, limit)

            # Dummy variable as json
            response = {'language': language}
            return ResponseDTO(201, response)
        except KeyError as ke:
            return ResponseDTO(404, "Error: key {ke} not found in request JSON data")
        except Exception as e:
            print(e, flush=True)
            return ResponseDTO(500, "Error: Something went wrong with the server")

    def detect_language_by_text(self, text, limit):
        try:
            language = self.language_service.detect_language(text, limit)

            # Dummy variable as json
            response = {'language': language}
            return ResponseDTO(201, response)
        except Exception as e:
            print(e, flush=True)
            return ResponseDTO(500, "Error: Something went wrong with the server")
