import requests
import pandas as pd
import os
import torch

from dotenv import load_dotenv
from sentence_transformers.util import semantic_search

model_id = "sentence-transformers/all-MiniLM-L6-v2"
hf_token = "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"

FILE_STORAGE_PATH_PYTHON = os.getenv("FILE_STORAGE_PATH_PYTHON")
load_dotenv()

api_url = f"https://api-inference.huggingface.co/pipeline/feature-extraction/{model_id}"
headers = {"Authorization": f"Bearer {hf_token}"}


class HuggingFaceEmbedding:

    def __init__(self):
        pass

    def query(self, texts):
        response = requests.post(api_url,
                                 headers=headers,
                                 json={
                                     "inputs": texts,
                                     "options": {
                                         "wait_for_model": True
                                     }
                                 })
        return response.json()

    def read_csv_file(self):
        parsed_dataframe = pd.read_csv(FILE_STORAGE_PATH_PYTHON +
                                       "structured_data.csv",
                                       usecols=['heading', 'paragraph'],
                                       sep='|')
        return parsed_dataframe

    def embed_dataset(self):
        print("Embedding dataset", flush=True)
        parsed_dataframe = self.read_csv_file()
        # extract the paragraphs from the "paragraph" column
        parsed_text = parsed_dataframe['heading'].tolist()
        parsed_text = [str(text) for text in parsed_text]
        embedded_text = self.query(parsed_text)
        embeddings = pd.DataFrame(embedded_text)

        embeddings.to_csv(FILE_STORAGE_PATH_PYTHON + "embeddings.csv",
                          index=False)
        print("\033[93m Embedding dataset done", flush=True)
        return embedded_text

    def query_for_text(self, text, k_number):
        print(text, flush=True)
        parsed_dataframe = self.read_csv_file()

        csv_document_load = pd.read_csv(FILE_STORAGE_PATH_PYTHON +
                                        "embeddings.csv")
        dataset_embeddings = torch.from_numpy(csv_document_load.to_numpy()).to(
            torch.float)

        output = self.query(text)
        query_embeddings = torch.FloatTensor(output)

        hits = semantic_search(query_embeddings,
                               dataset_embeddings,
                               top_k=k_number)
        corpus_ids = [hit['corpus_id'] for hit in hits[0]]
        extracted_rows = parsed_dataframe.loc[parsed_dataframe.index.isin(
            corpus_ids)]
        
        # Convert extracted_rows to JSON format
        extracted_rows_json = extracted_rows.to_json(orient='records')

        print(extracted_rows_json, flush=True)

        return extracted_rows_json
