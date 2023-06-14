import pandas as pd

from keybert import KeyBERT
from model.section_structure import SectionStructure

FILE_STORAGE_PATH_PYTHON = "/usr/aibot/file-storage/"


class KeywordService:

    def __init__(self):
        pass

    def get_keywords_from_section_structure(self, text_as_section_structure: SectionStructure):
        text_content = text_as_section_structure.get_paragraph()

        keywords_object = self.get_keywords(text_content)
        keywords = [t[0] for t in keywords_object]
        keywords.append(text_as_section_structure.get_heading())
        print(keywords, flush=True)

        return keywords

    def get_keywords(self, text):
        kw_model = KeyBERT()
        return kw_model.extract_keywords(text)

    def merge_keywords_to_structure_dataframe(self):
        parsed_dataframe = pd.read_csv(FILE_STORAGE_PATH_PYTHON +
                                       "structured_data.csv",
                                       usecols=['heading',
                                                'paragraph'],
                                       sep='|')

        print(parsed_dataframe, flush=True)

        for index, row in parsed_dataframe.iterrows():
            section_structure = SectionStructure()
            section_structure.set_all_values(
                0, row['heading'], row['paragraph'], 'en')
            # print(row['paragraph'], flush=True)
            keywords = self.get_keywords_from_section_structure(
                section_structure)

        return parsed_dataframe
