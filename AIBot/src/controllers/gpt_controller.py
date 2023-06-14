from services.gpt_service import GptService
from dto.response_dto import ResponseDTO
from services.embeddings_service import EmbeddingService

import json


class GptController:
    def __init__(self):
        self.gpt_service = GptService()
        self.embedding_service = EmbeddingService()

    def generate_text(self, request_data):
        try:
            response = self.gpt_service.generate_text_based_on_topic(
                request_data['TOPIC'], request_data['SELECTED_INFORMATION'], request_data['THEME'])
            return ResponseDTO(201, response)
        except KeyError as ke:
            print(ke, flush=True)
            return ResponseDTO(404, "Error: key {ke} not found in request JSON data")
        except Exception as e:
            print(e, flush=True)
            return ResponseDTO(500, "Error: Something went wrong with the server")
