from services.excel_extraction_service import ExcelExtractionService
from dto.response_dto import ResponseDTO


class ExcelExtractionController:
    def __init__(self):
        self.excel_extraction_service = ExcelExtractionService()

    def save_excel_file(self, request_file):
        try:
            if request_file.filename == "":
                raise Exception("Invalid file")

            self.excel_extraction_service.save_excel_file(request_file)
            return ResponseDTO(201, "File saved successfully")
        except Exception as e:
            print(e, flush=True)
            return ResponseDTO(500, "Error: Something went wrong with the server")

    def process_excel_file(self, request_file):
        try:
            if request_file.filename == "":
                raise Exception("Invalid file")

            self.excel_extraction_service.process_excel_file(request_file)
            return ResponseDTO(201, "File saved successfully")
        except Exception as e:
            print(e, flush=True)
            return ResponseDTO(500, "Error: Something went wrong with the server")
