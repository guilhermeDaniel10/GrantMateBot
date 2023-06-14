from services.keyword_service import KeywordService
from model.section_structure import SectionStructure
from dto.response_dto import ResponseDTO
from services.language_service import LanguageService


class KeywordController:

    def __init__(self):
        self.keyword_service = KeywordService()
        self.language_service = LanguageService()

    def get_keywords_from_section_structure_by_request(self, request_data):

        try:
            heading = request_data['heading']
            paragraph = request_data['paragraph']
            language = self.language_service.detect_language(paragraph, 1000)

            section_structure = SectionStructure()
            section_structure.set_all_values(0, heading, paragraph, language)

            keywords = self.keyword_service.get_keywords_from_section_structure(
                section_structure)

            response = {'keywords': keywords}
            return ResponseDTO(202, response)
        except KeyError as ke:
            return ResponseDTO(404, "Error: key {ke} not found in request JSON data")
        except Exception as e:
            print(e, flush=True)
            return ResponseDTO(500, "Error: Something went wrong with the server")

    def merge_keywords_to_structure_dataframe(self):
        try:
            keywords = self.keyword_service.merge_keywords_to_structure_dataframe()
            response = {'test': True}
            return ResponseDTO(202, response)
        except Exception as e:
            print(e, flush=True)
            return ResponseDTO(500, "Error: Something went wrong with the server")
