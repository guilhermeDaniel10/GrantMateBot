import pandas as pd
import csv
from services.document_extraction_service import DocumentExtractionService


FILE_STORAGE_PATH_PYTHON = "/usr/aibot/file-storage/"


class ExcelExtractionService:
    def __init__(self):
        pass

    def save_excel_file(self, excel_file):
        if excel_file.filename.endswith(".xlsx") and excel_file and excel_file.filename != "":
            excel_file.save(FILE_STORAGE_PATH_PYTHON + "extracted_data.xlsx")
        else:
            raise Exception("Invalid file")

    def process_excel_file(self, excel_file):
        titles_to_ignore = [
            "Call",
            "Topic",
            "Type of Action",
            "Proposal Number",
            "Title",
            "Author",
            "Proposal Type",
            "Proposal Acronym"]
        csv_file = FILE_STORAGE_PATH_PYTHON + "structured_data.csv"
        file_path = FILE_STORAGE_PATH_PYTHON + "extracted_data.xlsx"

        if excel_file.filename.endswith(".xlsx") and excel_file and excel_file.filename != "":
            excel_file.save(file_path)
        else:
            raise Exception("Invalid file")

        excel_data = pd.read_excel(file_path, sheet_name=None)

        for sheet_name, df in excel_data.items():
            print("Column Names:", flush=True)
            print(df.columns.tolist(), flush=True)  # Prints the column names
            print(f"Sheet Name: {sheet_name}", flush=True)
            print(df.head(n=10), flush=True)
            print("\n", flush=True)

            current_proposal_type = ""
            current_proporsal_acronym = ""

            for index, row in df.iterrows():
                value1 = row[0]
                value2 = row[1]
                if value1 == "Proposal Type":
                    current_proposal_type = value2

                if value1 == "Proposal Acronym":
                    print(value2, flush=True)
                    current_proporsal_acronym = value2

                if not pd.isna(value1) and not pd.isna(value2) and value1 not in titles_to_ignore:
                    topic_title = current_proposal_type + " " + \
                        current_proporsal_acronym + " " + value1
                    new_values = ['0', topic_title, value2, 'english']
                    with open(csv_file, 'a', newline='') as file:
                        writer = csv.writer(file, delimiter="|")
                        writer.writerow(new_values)
                    # print(row[0], flush=True)

            # prints the value of the column "A" in the first row
            # print(df["Título(s)"], flush=True)

        return excel_data
