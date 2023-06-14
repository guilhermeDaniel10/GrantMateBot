import docx

import os
from file_management.file import File


class WordFile(File):
    def read_file(self):
        doc = docx.Document(self.file_path)
        content = ''
        for para in doc.paragraphs:
            content += para.text + '\n'
        return content

    def print_content(self):
        print(self.read_file(), flush=True)
