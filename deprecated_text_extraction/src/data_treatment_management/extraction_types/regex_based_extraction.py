import fitz
import os
import re

from dotenv import load_dotenv
from data_treatment_management.section_structure import SectionStructure
from data_treatment_management.extraction_types.document_line import DocumentLine
from unidecode import unidecode
import pandas as pd

FILE_STORAGE_PATH_PYTHON = os.getenv("FILE_STORAGE_PATH_PYTHON")
load_dotenv()


class RegexBasedExtraction:

    def __init__(self):
        pass

    def extract_document_information(self,
                                     filename,
                                     strings_to_ignore=[],
                                     caps=False,
                                     bold=False,
                                     color=False,
                                     section_number=False):
        document_lines = self.extract_document_sections_structured(
            filename, strings_to_ignore, caps, bold, color, section_number)

        sections = self.convert_document_lines_to_section_structure(
            document_lines)
        df = self.create_dataframe(filename, sections)
        print("Document extracted", flush=True)

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

    #Checks if the text is a title based on the parameters passed (is all caps, is bold, has a different color, has section_number)
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
                if color != "NONE":
                    if self.is_text_this_color(span, color) == True:
                        return True
        #TODO: Fix this
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
            for block in blocks:  #iterate all blocks in the page
                current_header = ""
                current_section = ""
                if block['type'] == 0:  #if the block is a text block
                    for line in block[
                            'lines']:  #iterate all lines in the block
                        for span in line[
                                'spans']:  #iterate all spans in the line
                            text = unidecode(
                                span['text'])  #get the text from the span

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

        return document_lines

    #Converts the document lines to a section structure, that is a object that contains the heading and corresponding paragraphs
    def convert_document_lines_to_section_structure(self, document_lines):
        section_structures = []

        current_paragraph = ""
        current_heading = ""
        iteration = 0

        for document_line in document_lines:
            if document_line.get_line_type() == "HEADER":

                section_structure = self.create_section_structure(
                    iteration, current_heading, current_paragraph)
                section_structures.append(section_structure)

                current_heading = document_line.get_content()
                current_paragraph = ""
                iteration += 1
            elif document_line.get_line_type() == "PARAGRAPH":
                current_paragraph += document_line.get_content()

        return section_structures

    #Builder for the section structure
    def create_section_structure(self, iteration, heading, paragraph):
        section_structure = SectionStructure()
        section_structure.set_iteration(iteration)
        section_structure.set_heading(heading)
        section_structure.set_paragraph(paragraph)

        return section_structure

    #Checks if the string is empty
    def is_string_empty(self, variable):
        return variable.isspace() or variable == ""

    #Checks if the text is bold
    def is_text_bold(self, span):
        span_font = span['font']
        return "bold" in span_font.lower()

    #Checks if text is in all caps
    def is_text_upper(self, text):
        return re.sub("[\(\[].*?[\)\]]", "", text).isupper()

    #Checks if text is only in number format
    def is_text_only_number(self, text):
        return text.strip().isdigit()

    #Check if the text is a section number
    def is_text_with_section_number(self, text):
        pattern = r"^\d+(\.\d+)*\s*\w.*"
        return bool(re.match(pattern, text))

    #Check if the text is the same color as the one we want
    def is_text_this_color(self, span, color_as_hex):
        color_as_decimal = self.convert_hex_to_decimal(color_as_hex)
        min_value = color_as_decimal - 500
        max_value = color_as_decimal + 500
        return self.is_number_in_interval(span['color'], min_value, max_value)

    #check if number is in interval
    def is_number_in_interval(self, number, min, max):
        return min <= number <= max

    #Convert hex to decimal
    def convert_hex_to_decimal(self, hex):
        return int(hex, 16)

    #Check if the previous line is a heading
    def is_previous_line_heading(self, iteration):
        return iteration > 0

    #Check if the text is in the list of strings to ignore
    def strings_to_ignore(self, text, strings_to_ignore):
        current_text = text.strip()
        for string in strings_to_ignore:
            current_string_to_ignore = string.strip()
            if current_string_to_ignore == current_text:  #must exactly match
                return True
        return False

    #Get the filename without extension
    def filename_without_extension(self, filename):
        return os.path.splitext(filename)[0]

    #Create a dataframe from the sections
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
