import os
from file_management.file_manager import FileManager
import transformers

from dotenv import load_dotenv

load_dotenv()
FILE_STORAGE_PATH_PYTHON = os.getenv("FILE_STORAGE_PATH_PYTHON")


class BertDataTreatment:
    def __init__(self):
        # empty constructor
        pass

    def preprocess_file_contents(self, text, filename):
        tokenizer = transformers.BertTokenizer.from_pretrained(
            "bert-base-uncased")
        text = text.lower()  # Convert to lowercase
        tokens = tokenizer.tokenize(text)  # Tokenize text into subwords

        output_dir, input_filename = os.path.split(filename)
        output_filename = os.path.splitext(input_filename)[
            0] + "_tokenized.txt"
        output_path = os.path.join(
            FILE_STORAGE_PATH_PYTHON, output_dir, output_filename
        )

        file_manager = FileManager()
        file_manager.read_list_to_txt(output_path, tokens)

        return output_path
