from services.document_extraction_service import DocumentExtractionService
from dto.response_dto import ResponseDTO
from services.document_extraction_chunk_based_service import DocumentExtractionChunkBasedService


class DocumentBasedExtractionController:
    def __init__(self):
        self.document_extraction_service = DocumentExtractionService()
        self.document_extraction_chunk_service = DocumentExtractionChunkBasedService()
        pass

    def extract_document_information(self,
                                     request_data):
        try:
            filename = request_data['filename']
            print(filename, flush=True)
            strings_to_ignore = request_data['strings_to_ignore']
            caps = request_data['caps']
            bold = request_data['bold']
            color = request_data['color']
            print("COLOR", color, flush=True)
            # section_number = request_data['section_number']
            document_extraction_dto = self.document_extraction_service.extract_document_information(
                filename, strings_to_ignore, caps, bold, color)

            return ResponseDTO(201, document_extraction_dto)
        except KeyError as ke:
            print(ke, flush=True)
            return ResponseDTO(404, "Error: key {ke} not found in request JSON data")
        except Exception as e:
            print(e, flush=True)
            return ResponseDTO(500, "Error: Something went wrong with the server")

    def extract_document_information_alternative(self, request_data):
        try:
            filename = request_data['filename']
            print(filename, flush=True)

            document_extraction_dto = self.document_extraction_chunk_service.extract(
                filename)

            return ResponseDTO(201, document_extraction_dto)
        except KeyError as ke:
            print(ke, flush=True)
            return ResponseDTO(404, "Error: key {ke} not found in request JSON data")
        except Exception as e:
            print(e, flush=True)
            return ResponseDTO(500, "Error: Something went wrong with the server")

    # NOT IDEAL FOR EUROSTARS
    def extract_document_using_pdfstructure(self, request_data):
        try:
            filename = request_data['filename']
            self.document_extraction_service.extract_document_using_pdfstructure(
                filename)

            response = {'test': True}
            return ResponseDTO(201, response)
        except Exception as e:
            print(e, flush=True)
            return ResponseDTO(500, "Error: Something went wrong with the server")

    def extract_document_to_txt(self, request_data):
        try:
            filename = request_data['filename']
            document_text = self.document_extraction_service.extract_pdf_to_txt_file(
                filename)

            response = {'information': document_text}
            return ResponseDTO(201, response)
        except KeyError as ke:
            return ResponseDTO(404, "Error: key {ke} not found in request JSON data")
        except Exception as e:
            print(e, flush=True)
            return ResponseDTO(500, "Error: Something went wrong with the server")

    def get_structured_dataframe_data(self):
        try:
            dataframe = self.document_extraction_service.get_structured_data_from_dataframe()
            return ResponseDTO(201, dataframe)
        except Exception as e:
            print(e, flush=True)
            return ResponseDTO(500, "Error: Something went wrong with the server")
