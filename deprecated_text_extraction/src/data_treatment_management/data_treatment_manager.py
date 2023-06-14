from data_treatment_management.extraction_types.regex_based_extraction import RegexBasedExtraction


class DataTreatmentManager:
    def __init__(self):
        pass

    def extract_data(self, filename, extract_type):
        pass

    def extract_data_using_regex(self, filename, regex=""):
        regex_based_extraction = RegexBasedExtraction()
        regex_based_extraction.extract_using_regex(filename, regex)

    def extract_data_from_document_with_parameters(self,filename, strings_to_ignore = [], caps = False, bold = False, colors = ["NONE"], section_number = False):
        print(filename, flush=True)
        regex_based_extraction = RegexBasedExtraction()
        regex_based_extraction.extract_document_information(filename, strings_to_ignore, caps, bold, colors, section_number)
    
    def extract_data_for_eurostar(self, filename, strings_to_ignore = []):
        regex_based_extraction = RegexBasedExtraction()
        regex_based_extraction.eurostar_based_extraction(filename, strings_to_ignore)
        

