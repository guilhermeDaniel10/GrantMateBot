import requests
import pandas as pd
from dto.embeddings_creation_dto import EmbeddingsCreationDto
import torch
import json
import faiss
import time
from sentence_transformers import SentenceTransformer



from sentence_transformers.util import semantic_search

model_id = "sentence-transformers/all-MiniLM-L6-v2"
hf_token = "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"

FILE_STORAGE_PATH_PYTHON = "/usr/aibot/file-storage/"

api_url = f"https://api-inference.huggingface.co/pipeline/feature-extraction/{model_id}"
headers = {"Authorization": f"Bearer {hf_token}"}


class EmbeddingService:
    def __init__(self):
        self.model = SentenceTransformer("msmarco-MiniLM-L-12-v3")

    def query(self, texts):
        response = requests.post(
            api_url,
            headers=headers,
            json={"inputs": texts, "options": {"wait_for_model": True}},
        )
        return response.json()

    def read_csv_file(self):
        parsed_dataframe = pd.read_csv(
            FILE_STORAGE_PATH_PYTHON + "structured_data.csv",
            usecols=["heading", "paragraph"],
            sep="|",
        )
        return parsed_dataframe

    def embed_dataset_hugging_face(self):
        print("Embedding dataset", flush=True)
        parsed_dataframe = self.read_csv_file()
        # extract the paragraphs from the "paragraph" column
        parsed_text = parsed_dataframe["heading"].tolist()
        parsed_text = [str(text) for text in parsed_text]
        print("HERE 1", flush=True)
        embedded_text = self.query(parsed_text)
        print("HERE 2", flush=True)
        embeddings = pd.DataFrame(embedded_text)

        embeddings.to_csv(FILE_STORAGE_PATH_PYTHON + "embeddings.csv", index=False)
        print("\033[93m Embedding dataset done", flush=True)

        embeddings_creation_dto = EmbeddingsCreationDto(
            len(embeddings.index), len(embeddings.columns)
        )
        return embeddings_creation_dto.to_json()

    def query_for_text_hugging_face(self, text, k_number):
        print(text, flush=True)
        parsed_dataframe = self.read_csv_file()

        csv_document_load = pd.read_csv(FILE_STORAGE_PATH_PYTHON + "embeddings.csv")
        dataset_embeddings = torch.from_numpy(csv_document_load.to_numpy()).to(
            torch.float
        )

        output = self.query(text)
        query_embeddings = torch.FloatTensor(output)

        hits = semantic_search(query_embeddings, dataset_embeddings, top_k=k_number)
        corpus_ids = [hit["corpus_id"] for hit in hits[0]]
        extracted_rows = parsed_dataframe.loc[parsed_dataframe.index.isin(corpus_ids)]

        # Convert extracted_rows to JSON format
        extracted_rows_json = extracted_rows.to_json(orient="records")

        print(extracted_rows_json, flush=True)

        return extracted_rows_json

    def embed_using_faiss(self):
        index_dataframe_path = FILE_STORAGE_PATH_PYTHON + "index_dataframe"
        dataframe_headings = self.get_headings_list()

        dataframe_embds = self.model.encode(dataframe_headings)
        print(dataframe_embds, flush=True)

        index = faiss.IndexFlatL2(dataframe_embds.shape[1])
        index.add(dataframe_embds)
        faiss.write_index(index, index_dataframe_path)
        index = faiss.read_index(index_dataframe_path)

        embeddings_creation_dto = EmbeddingsCreationDto(
            len(dataframe_embds), len(dataframe_embds[0])
        )
        return embeddings_creation_dto.to_json()

    def query_using_faiss(self, query, k_number):
        index_dataframe_path = FILE_STORAGE_PATH_PYTHON + "index_dataframe"
        index = faiss.read_index(index_dataframe_path)
        full_dataframe = self.read_csv_file()

        t = time.time()
        query_vector = self.model.encode([query])
        k = k_number
        print("totaltime: {}".format(time.time() - t))

        distances, ann = index.search(query_vector, k)
        results = pd.DataFrame({"distance": distances[0], "ann": ann[0]})
        merge = pd.merge(
            results,
            full_dataframe[["heading", "paragraph"]],
            left_on="ann",
            right_index=True,
        )

        print(merge.head, flush=True)
        extracted_rows_json = merge.to_json(orient="records")

        return json.loads(extracted_rows_json)

    def get_headings_list(self):
        parsed_dataframe = self.read_csv_file()
        dataframe_headings = parsed_dataframe["heading"].tolist()
        return dataframe_headings

