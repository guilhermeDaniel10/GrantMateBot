import openai
import pandas as pd
import os

from typing import Dict, List, Tuple
from dotenv import load_dotenv

MODEL_NAME = "curie"

DOC_EMBEDDINGS_MODEL = f"text-search-{MODEL_NAME}-doc-001"
QUERY_EMBEDDINGS_MODEL = f"text-search-{MODEL_NAME}-query-001"

FILE_STORAGE_PATH_PYTHON = os.getenv("FILE_STORAGE_PATH_PYTHON")
load_dotenv()


class GPT3Embeddings:

    def __init__(self):
        pass

    def load_document(self, filename):
        df = pd.read_csv(FILE_STORAGE_PATH_PYTHON + filename, sep='|')
        df = df.set_index(["iteration", "heading", "paragraph"])
        print(f"{len(df)} rows in the data.", flush=True)
        print(df.sample(5), flush=True)

        return df
        

    def get_embedding(self, text: str, model: str) -> List[float]:
        #openai.api_key = "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"
        result = openai.Embedding.create(model='text-embedding-ada-002', input=text)
        print(result["data"][0]["embedding"], flush=True)
        return result["data"][0]["embedding"]

    def get_doc_embedding(self, text: str) -> List[float]:
        return self.get_embedding(text, DOC_EMBEDDINGS_MODEL)

    def get_query_embedding(self, text: str) -> List[float]:
        return self.get_embedding(text, QUERY_EMBEDDINGS_MODEL)

    def compute_doc_embeddings(self, filename, df: pd.DataFrame) -> pd.DataFrame:

        df = df.reset_index()
        embeddings = [
            self.get_doc_embedding(str(paragraph).replace("\n", " "))
            for paragraph in df["paragraph"]
        ]
        new_df = pd.DataFrame({"embedding": embeddings}, index=df.index)
        output_df = pd.concat([df, new_df], axis=1)
        output_df.to_csv(FILE_STORAGE_PATH_PYTHON + filename + "_embedding", sep='|', index=True)
        return output_df

    
    def load_embeddings(self,fname: str) -> Dict[Tuple[str, str], List[float]]:
        
        df = pd.read_csv(fname, header=0)
        max_dim = max([int(c) for c in df.columns if c != "heading"])
        return {
            (r.heading): [r[str(i)] for i in range(max_dim + 1)] for _, r in df.iterrows()
        }