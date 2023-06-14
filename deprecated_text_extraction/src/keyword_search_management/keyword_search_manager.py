import re
import os
import PyPDF2

from dotenv import load_dotenv

FILE_STORAGE_PATH_PYTHON = os.getenv("FILE_STORAGE_PATH_PYTHON")
load_dotenv()


class KeywordManager:

    def __init__(self):
        pass

    def search_for_keyword(self, filename, keyword):
        pattern = re.compile(rf'{keyword}.*', re.DOTALL)

        # Open the PDF file in binary mode
        with open(FILE_STORAGE_PATH_PYTHON + filename, 'rb') as pdf_file:

            # Create a PDF reader object
            pdf_reader = PyPDF2.PdfReader(pdf_file)

            # Loop through each page in the PDF file
            for page_num in range(len(pdf_reader.pages)):

                # Get the page object
                page_text = pdf_reader.pages[page_num].extract_text()

                # Search for the specific word using the regular expression pattern
                match = re.search(pattern, page_text)

                # If a match is found, extract the portion of the text that matches the pattern
                if match:
                    matched_text = match.group(0)
                    print(matched_text)
