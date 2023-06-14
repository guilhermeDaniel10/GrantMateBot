import fitz
import re
import os

FILE_STORAGE_PATH_PYTHON = "/usr/aibot/file-storage/"


class DocumentExtractionChunkBasedService:
    def __init__(self):
        pass

    def extract(self, path, start_page=1, end_page=None, word_length=150):
        full_path = FILE_STORAGE_PATH_PYTHON + path
        texts = self.pdf_to_text(full_path, start_page=start_page)
        chunks = self.text_to_chunks(texts, start_page=start_page)

        with open(FILE_STORAGE_PATH_PYTHON + "output.txt", "w") as txt_file:
            for line in chunks:
                # works with any number of elements in a line
                txt_file.write(line + "\n\n")
        return chunks

    def preprocess(self, text):
        text = text.replace('\n', ' ')
        text = re.sub('\s+', ' ', text)
        return text

    def pdf_to_text(self, path, start_page=1, end_page=None):
        doc = fitz.open(path)
        total_pages = doc.page_count

        if end_page is None:
            end_page = total_pages

        text_list = []

        for i in range(start_page-1, end_page):
            text = doc.load_page(i).get_text("text")
            text = self.preprocess(text)
            text_list.append(text)

        doc.close()
        return text_list

    def text_to_chunks(self, texts, word_length=150, start_page=1):
        text_toks = [t.split(' ') for t in texts]
        page_nums = []
        chunks = []

        for idx, words in enumerate(text_toks):
            for i in range(0, len(words), word_length):
                chunk = words[i:i+word_length]
                if (i+word_length) > len(words) and (len(chunk) < word_length) and (
                        len(text_toks) != (idx+1)):
                    text_toks[idx+1] = chunk + text_toks[idx+1]
                    continue
                chunk = ' '.join(chunk).strip()
                chunk = f'[{idx+start_page}]' + ' ' + '"' + chunk + '"'
                chunks.append(chunk)
        return chunks
