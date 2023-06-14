
from services.embeddings_service import EmbeddingService
from dto.response_dto import ResponseDTO


class EmbeddingsController:
    def __init__(self):
        self.embedding_service = EmbeddingService()
        pass

    def embed_dataset_hugging_face(self):
        try:
            # section_number = request_data['section_number']
            embeddings_dto = self.embedding_service.embed_dataset_hugging_face()

            return ResponseDTO(201, embeddings_dto)
        except Exception as e:
            print(e, flush=True)
            return ResponseDTO(500, "Error: Something went wrong with the server")

    def query_for_topic_hugging_face(self, request_data):
        try:
            text = request_data['text']
            k_number = request_data['k_number']
            query_dto_result = self.embedding_service.query_for_text_hugging_face(
                text, k_number)

            return ResponseDTO(201, query_dto_result)
        except KeyError:
            return ResponseDTO(404, "Error: keys not found in request JSON data")
        except Exception as e:
            print(e, flush=True)
            return ResponseDTO(500, "Error: Something went wrong with the server")

    def embed_using_faiss(self):
        try:
            embeddings_dto = self.embedding_service.embed_using_faiss()
            return ResponseDTO(201, embeddings_dto)
        except Exception as e:
            print(e, flush=True)
            return ResponseDTO(500, "Error: Something went wrong with the server")

    def query_using_faiss(self, request_data):
        try:
            text = request_data['text']
            k_number = request_data['k_number']
            query_dto_result = self.embedding_service.query_using_faiss(
                text, k_number)

            return ResponseDTO(201, query_dto_result)
        except KeyError:
            return ResponseDTO(404, "Error: keys not found in request JSON data")
        except Exception as e:
            print(e, flush=True)
            return ResponseDTO(500, "Error: Something went wrong with the server")
