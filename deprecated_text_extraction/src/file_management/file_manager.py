import os
from dotenv import load_dotenv
from file_management.file_types.text_file import TextFile
from file_management.file_types.word_file import WordFile
from file_management.file_types.pdf_file import PdfFile

load_dotenv()
FILE_STORAGE_PATH_PYTHON = os.getenv("FILE_STORAGE_PATH_PYTHON")
OUTPUT_ALREADY_EXISTS = "Output file already exists"


class FileManager:
    def __init__(self):
        # Empty constructor
        pass

    def read_file(self, file_name, file_extension):
        file_path = FILE_STORAGE_PATH_PYTHON + file_name
        if file_extension == ".txt":
            file_obj = TextFile(file_path)
        elif file_extension == ".docx":
            file_obj = WordFile(file_path)
        elif file_extension == ".pdf":
            file_obj = PdfFile(file_path)
        else:
            raise ValueError("Unsupported file type")

        return file_obj.read_file()

    def read_file_to_txt(self, file_name, file_extension):
        read_file_content = self.read_file(file_name, file_extension)

        output_dir, input_filename = os.path.split(file_name)
        output_filename = os.path.splitext(input_filename)[0] + ".txt"
        output_path = os.path.join(
            FILE_STORAGE_PATH_PYTHON, output_dir, output_filename
        )

        print(output_path, flush=True)

        if os.path.exists(output_path):
            raise ValueError(OUTPUT_ALREADY_EXISTS)

        with open(output_path, "w") as f:
            f.write(read_file_content)

    def read_list_to_txt(self, file, content):
        with open(file, 'w') as f:
            for token in content:
                f.write(token + '\n')

    def save_content_as_txt(self, file_name, content):
        output_dir, input_filename = os.path.split(file_name)

        print(os.path.splitext(input_filename)[1], flush=True)
        if os.path.splitext(input_filename)[1] == ".txt":
            return os.path.join(
                FILE_STORAGE_PATH_PYTHON, output_dir, file_name
            )

        output_filename = os.path.splitext(input_filename)[0] + ".txt"
        output_path = os.path.join(
            FILE_STORAGE_PATH_PYTHON, output_dir, output_filename
        )

        if os.path.exists(output_path):
            raise ValueError(OUTPUT_ALREADY_EXISTS)

        with open(output_path, "w") as f:
            f.write(content)

        return output_path

    def data_treatment_to_jsonl(self, data_treatment_service, filename, file_extension):
        read_file_content = self.read_file(filename, file_extension)

        data_pre_processed = data_treatment_service.pre_process(
            read_file_content, filename
        )
        prepared_jsonl_data = data_treatment_service.prepare_data_to_jsonl(
            data_pre_processed
        )

        self.save_file_as_jsonl(filename, prepared_jsonl_data)
        print(prepared_jsonl_data, flush=True)

    def save_file_as_jsonl(self, filename, jsonl_content):
        output_dir, input_filename = os.path.split(filename)
        output_filename = os.path.splitext(input_filename)[0] + ".jsonl"
        output_path = os.path.join(
            FILE_STORAGE_PATH_PYTHON, output_dir, output_filename
        )

        if os.path.exists(output_path):
            raise ValueError("Output file already exists")

        with open(output_path, "w") as f:
            f.write(jsonl_content)
