import PyPDF2
from file_management.file import File


class PdfFile(File):
    # Read a pdf file
    def read_file(self):
        with open(self.file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            num_pages = len(pdf_reader.pages)
            content = ''
            for page in range(num_pages):
                pdf_page = pdf_reader.pages[page]

                page_text = pdf_page.extract_text()
                content += page_text
        return content

    # Write content to a file
    def write_file(self, content):
        with open(self.file_path, 'wb') as file:
            pdf_writer = PyPDF2.PdfFileWriter()
            pdf_writer.addPage(PyPDF2.pdf.PageObject.createTextObject(content))
            pdf_writer.write(file)

    # Prints the content of a file

    def print_content(self):
        print(self.read_file(), flush=True)
