from services.summarize_service import SummarizeService
from dto.response_dto import ResponseDTO


class SummarizeController:
    def __init__(self):
        self.summarize_service = SummarizeService()
        pass

    def summarize(self, request_data):
        try:
            text = request_data['text']
            percentage = request_data['percentage']
            summarize_dto_result = self.summarize_service.summarize(
                text, percentage)

            return ResponseDTO(201, summarize_dto_result)
        except KeyError:
            return ResponseDTO(404, "Error: keys not found in request JSON data")
        except Exception as e:
            print(e, flush=True)
            return ResponseDTO(500, "Error: Something went wrong with the server")

    def summarize_transformers(self, requets_data):
        try:
            text = requets_data['text']
            min_length = requets_data['min']
            max_length = requets_data['max']
            summarize_dto_result = self.summarize_service.summarize_transformers(
                text, min_length, max_length)

            return ResponseDTO(201, summarize_dto_result)
        except KeyError:
            return ResponseDTO(404, "Error: keys not found in request JSON data")
        except Exception as e:
            print(e, flush=True)
            return ResponseDTO(500, "Error: Something went wrong with the server")
