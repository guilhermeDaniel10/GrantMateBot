from ai_model_management.embeddings.hugging_face_embedding import HuggingFaceEmbedding
from ai_model_management.model_types.bert.bert_train import BertTrain
from ai_model_management.model_types.gpt2.gpt2_train import GPT2Train
from ai_model_management.model_types.gpt3.gpt3_embeddings import GPT3Embeddings


class ModelManager:

    def __init__(self):
        pass

    def train_model(self, model, filename, file_content):
        # Empty constructor

        if model == "BERT":
            bert_train = BertTrain(filename)
        elif model == "GPT2":
            gpt2_train = GPT2Train()
            gpt2_train.fine_tune_gpt3(file_content)

    def generate_text(self, model, prompt):
        if model == "GPT2":
            gpt2_train = GPT2Train()
            gpt2_train.generate_text_gpt3(prompt)
            print("OK", flush=True)
        if model == "GPT3":
            hugging_face_embeddings = HuggingFaceEmbedding()
            hugging_face_embeddings.embed_dataset()
            hugging_face_embeddings.query_for_text("eHealth")

    def embed_dataset(self):
        hugging_face_embeddings = HuggingFaceEmbedding()
        hugging_face_embeddings.embed_dataset()

    def query_for_topic(self, topic_prompt, k_number):
        hugging_face_embeddings = HuggingFaceEmbedding()
        return hugging_face_embeddings.query_for_text(topic_prompt, k_number)
