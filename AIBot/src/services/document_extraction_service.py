import fitz
import os
import re
import pandas as pd
from flask import jsonify

from model.document_line import DocumentLine
from model.section_structure import SectionStructure
from dto.document_extraction_dto import DocumentExtractionDTO
from services.language_service import LanguageService
from pdfstructure.hierarchy.parser import HierarchyParser
from pdfstructure.source import FileSource
from pdfstructure.printer import PrettyStringPrinter
from unidecode import unidecode

FILE_STORAGE_PATH_PYTHON = "/usr/aibot/file-storage/"


class DocumentExtractionService:
    def __init__(self):
        self.language_service = LanguageService()

    def extract_document_using_pdfstructure(self, filename):
        parser = HierarchyParser()
        # specify source (that implements source.read())
        source = FileSource(FILE_STORAGE_PATH_PYTHON + filename)

        # analyse document and parse as nested data structure
        document = parser.parse_pdf(source)

        stringExporter = PrettyStringPrinter()
        prettyString = stringExporter.print(document)

        print(prettyString, flush=True)

        with open(FILE_STORAGE_PATH_PYTHON + 'test.txt', 'w') as f:
            f.write(prettyString)

    def extract_document_information(self,
                                     filename,
                                     strings_to_ignore=[],
                                     caps=False,
                                     bold=False,
                                     color=False,
                                     section_number=False):

        document_sample = self.get_document_text_sample(filename)
        document_language = self.language_service.detect_language(
            document_sample, 1000)

        document_lines, page_num = self.extract_document_sections_structured(
            filename, strings_to_ignore, caps, bold, color, section_number)

        sections = self.convert_document_lines_to_section_structure(
            document_lines, document_language)
        df = self.create_dataframe(filename, sections)
        print("Document extracted", flush=True)

        document_extraction_dto = DocumentExtractionDTO(
            page_num, len(document_lines))

        return document_extraction_dto.to_json()

    def extract_pdf_to_txt_file(self, filename):
        # Open the PDF file
        with fitz.open(FILE_STORAGE_PATH_PYTHON + filename) as doc:
            # filename without extension
            filename_without_extension = os.path.splitext(filename)[0]

            filename_to_txt = FILE_STORAGE_PATH_PYTHON + filename_without_extension + '.txt'

            # Create a text file to store the extracted text
            with open(filename_to_txt, 'w', encoding='utf-8') as f:

                # Iterate through the pages of the PDF
                for page in doc:
                    output = page.get_text("blocks")
                    previous_block_id = 0  # Set a variable to mark the block id

                    for block in output:
                        if block[6] == 0:  # We only take the text
                            if previous_block_id != block[5]:
                                f.write("\n")
                            f.write(block[4])

                    # Extract the text from the page
        #            text = page.get_text()

                    # Write the extracted text to the output file
        #            f.write(text)

        with open(filename_to_txt, 'r') as file:
            text = file.read().splitlines()

        return text

    def read_document_blocks(self, filename):
        doc = fitz.open(FILE_STORAGE_PATH_PYTHON + filename)
        block_dict = {}
        page_num = 1

        for page in doc:  # Iterate all pages in the document
            file_dict = page.get_text('dict',
                                      sort=True)  # Get the page dictionary
            block = file_dict['blocks']  # Get the block information
            block_dict[page_num] = block  # Store in block dictionary
            page_num += 1  # Increase the page value by 1

        return block_dict, page_num

    # Checks if the text is a title based on the parameters passed (is all caps, is bold, has a different color, has section_number)
    def is_text_title(self,
                      span,
                      caps=False,
                      bold=False,
                      colors=False,
                      section_number=False):
        if caps != False:
            if self.is_text_upper(unidecode(span['text'])) == True:
                return True
        if bold != False:
            if self.is_text_bold(span) == True:
                return True
        if colors != False:
            for color in colors:
                if color != "NONE" and color != " " and color != "":
                    if self.is_text_this_color(span, color) == True:
                        return True
        # TODO: Fix this
        '''
        if section_number != False:
            if self.is_text_with_section_number(unidecode(
                    span['text'])) == True:
                return True
        return False
        '''

    def extract_document_sections_structured(self,
                                             filename,
                                             strings_to_ignore=[],
                                             caps=False,
                                             bold=False,
                                             color=False,
                                             section_number=False):
        current_header = ""
        current_section = ""
        document_lines = []

        block_dict, page_num = self.read_document_blocks(filename)

        for page_num, blocks in block_dict.items(
        ):  # Iterate all pages in the block dictionary
            for block in blocks:  # iterate all blocks in the page
                current_header = ""
                current_section = ""
                if block['type'] == 0:  # if the block is a text block
                    for line in block[
                            'lines']:  # iterate all lines in the block
                        for span in line[
                                'spans']:  # iterate all spans in the line
                            text = unidecode(
                                span['text'])  # get the text from the span

                            if self.strings_to_ignore(
                                    text, strings_to_ignore) == False:
                                if self.is_text_title(span, caps, bold, color,
                                                      section_number) == True:
                                    current_header += " " + text
                                else:
                                    current_section += " " + text

                if self.is_string_empty(current_header) == False:
                    document_line = DocumentLine()
                    document_line.set_line("HEADER", current_header)
                    document_lines.append(document_line)

                if self.is_string_empty(current_section) == False:
                    document_line = DocumentLine()
                    document_line.set_line("PARAGRAPH", current_section)
                    document_lines.append(document_line)

        return document_lines, page_num

    # Converts the document lines to a section structure, that is a object that contains the heading and corresponding paragraphs
    def convert_document_lines_to_section_structure(self, document_lines, language):
        section_structures = []

        current_paragraph = ""
        current_heading = ""
        iteration = 0

        for document_line in document_lines:
            if document_line.get_line_type() == "HEADER":

                section_structure = self.create_section_structure(
                    iteration, current_heading, current_paragraph, language)
                section_structures.append(section_structure)

                current_heading = document_line.get_content()
                current_paragraph = ""
                iteration += 1
            elif document_line.get_line_type() == "PARAGRAPH":
                current_paragraph += document_line.get_content()

        return section_structures

    # Builder for the section structure
    def create_section_structure(self, iteration, heading, paragraph, language):
        section_structure = SectionStructure()
        section_structure.set_iteration(iteration)
        section_structure.set_heading(heading)
        section_structure.set_paragraph(paragraph)
        section_structure.set_language(language)

        return section_structure

    def get_document_text_sample(self, filename):
        doc = fitz.open(FILE_STORAGE_PATH_PYTHON + filename)

        print("Document:", FILE_STORAGE_PATH_PYTHON + filename, flush=True)
        print("Pages:", len(doc), flush=True)

        # iterate over the first 3 pages of the document
        text = ''
        page_num = 1

        for page in doc:  # Iterate all pages in the document
            text += page.get_text('text')  # Get the page dictionary
            page_num += 1  # Increase the page value by 1

            if page_num == 3:
                break

        print("Text extracted", flush=True)
        return text[:1000]

    # Checks if the string is empty
    def is_string_empty(self, variable):
        return variable.isspace() or variable == ""

    # Checks if the text is bold
    def is_text_bold(self, span):
        span_font = span['font']
        return "bold" in span_font.lower()

    # Checks if text is in all caps
    def is_text_upper(self, text):
        return re.sub("[\(\[].*?[\)\]]", "", text).isupper()

    # Checks if text is only in number format
    def is_text_only_number(self, text):
        return text.strip().isdigit()

    # Check if the text is a section number
    def is_text_with_section_number(self, text):
        pattern = r"^\d+(\.\d+)*\s*\w.*"
        return bool(re.match(pattern, text))

    # Check if the text is the same color as the one we want
    def is_text_this_color(self, span, color_as_hex):
        color_as_decimal = self.convert_hex_to_decimal(color_as_hex)
        min_value = color_as_decimal - 500
        max_value = color_as_decimal + 500
        return self.is_number_in_interval(span['color'], min_value, max_value)

    # check if number is in interval
    def is_number_in_interval(self, number, min, max):
        return min <= number <= max

    # Convert hex to decimal
    def convert_hex_to_decimal(self, hex):
        return int(hex, 16)

    # Check if the previous line is a heading
    def is_previous_line_heading(self, iteration):
        return iteration > 0

    # Check if the text is in the list of strings to ignore
    def strings_to_ignore(self, text, strings_to_ignore):
        current_text = text.strip()
        for string in strings_to_ignore:
            current_string_to_ignore = string.strip()
            if current_string_to_ignore == current_text:  # must exactly match
                return True
        return False

    # Get the filename without extension
    def filename_without_extension(self, filename):
        return os.path.splitext(filename)[0]

    # Create a dataframe from the sections
    def create_dataframe(self, filename, sections):
        structured_data_path = FILE_STORAGE_PATH_PYTHON + "structured_data.csv"
        if os.path.exists(structured_data_path):
            mode = 'a'
            header = False
        else:
            mode = 'w'
            header = True

        df = pd.DataFrame.from_records(
            [section.to_dict() for section in sections])
        df.to_csv(structured_data_path,
                  sep="|",
                  mode=mode,
                  header=header,
                  index=False)

        print(df, flush=True)

        return df

    def get_structured_data_from_dataframe(self):
        structured_data_path = FILE_STORAGE_PATH_PYTHON + "structured_data.csv"
        if not os.path.exists(structured_data_path):
            return []

        df = pd.read_csv(structured_data_path, sep="|")

        json_array = []

        for index, row in df.iterrows():
            section_structure = SectionStructure()
            section_structure.set_all_values(
                0, row['heading'], row['paragraph'], 'en')
            json_array.append(section_structure.to_simple_dict())
            # print(row['paragraph'], flush=True)

        return json_array
    

