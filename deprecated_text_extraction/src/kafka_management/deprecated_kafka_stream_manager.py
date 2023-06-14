import json
import os

from dotenv import load_dotenv
from kafka import KafkaProducer
from file_management.file_manager import FileManager
from ai_model_management.deprecated_data_treatment import DeprecatedDataTreatmentService
from ai_model_management.model_manager import ModelManager
from ai_model_management.data_process import DataProcess
from data_treatment_management.data_treatment_manager import DataTreatmentManager
from keyword_search_management.keyword_search_manager import KeywordManager

load_dotenv()
KAFKA_BROKER_ADDRESS = os.getenv("KAFKA_BROKER_ADDRESS")


class KafkaStreamManager:

    def __init__(self):
        self.producer = KafkaProducer(bootstrap_servers=[KAFKA_BROKER_ADDRESS])
        self.file_manager = FileManager()
        self.model_manager = ModelManager()
        self.data_process = DataProcess()
        self.data_treatment_manager = DataTreatmentManager()
        self.keyword_manager = KeywordManager()

    def stream_type_manager(self, stream_message):
        stream_message = stream_message.value

        print(stream_message, flush=True)
        stream_type = stream_message["streamType"]
        payload = stream_message["payload"]

        print(stream_type, flush=True)

        if "FILE_UPLOAD" in stream_type:
            filename = payload["filename"]
            extension = payload["extension"]
            print(stream_type, flush=True)
            file_content = self.file_manager.read_file(filename, extension)

            if stream_type == "FILE_UPLOAD":  #This is the embeddings option
                print("\033[93m DOING EMBEDDING", flush=True)

                self.file_manager.save_content_as_txt(filename, file_content)
                self.data_treatment_manager.extract_data_from_document_with_parameters(
                    filename, ['EUROSTARS', 'Aim higher', 'APPLICATION FORM'],
                    False, True, False, False)

            elif stream_type == "FILE_UPLOAD_GPT2":
                print("\033[93m TRAINING WITH GPT-2")

                self.model_manager.train_model("GPT2", filename, file_content)
                self.success_model_file_upload(filename, 'GPT-2')

            elif stream_type == "FILE_UPLOAD_BERT":
                print("\033[93m TRAINING WITH BERT")
                self.model_manager.train_model("BERT", filename, file_content)
                self.success_model_file_upload(filename, 'BERT')

            else:
                print("Unspecified model", flush=True)
        elif "GENERATE_TEXT_VIA_PROMPT" in stream_type:
            if stream_type == "GENERATE_TEXT_VIA_PROMPT_GPT2":
                print(payload["prompt"], flush=True)
                prompt = payload["prompt"]
                print("RECEIVED A GENERATE TEXT MESSAGE", flush=True)
                print(prompt, flush=True)
                self.model_manager.generate_text("GPT2", prompt)
            if stream_type == "GENERATE_TEXT_VIA_PROMPT_GPT3":
                prompt = payload["prompt"]
                print(payload["prompt"], flush=True)
                print("RECEIVED A GENERATE TEXT MESSAGE", flush=True)
                self.model_manager.generate_text("GPT3", prompt)
        elif "TOPIC_SEARCH" in stream_type:
            print("RECEIVED A TOPIC SEARCH MESSAGE", flush=True)
            print(payload, flush=True)
            topic_to_query = payload["topic"]
            self.model_manager.query_for_topic(topic_to_query)
            self.generic_success_information("KAFKA_TOPIC_SEARCH_RESPONSE",
                                             payload["correlation_id"])

    def generic_success_information(self, topic, correlation_id):
        data = {"success": True, "correlation_id": correlation_id}
        message = json.dumps(data)
        self.producer.send(topic, message.encode("utf-8"))
        self.producer.flush()

        print("Sent response to topic: " + topic, flush=True)

    def success_model_file_upload(self, filename, model):

        train_information = {"filename": filename, "model": model}
        data = {
            "information": train_information,
            "success": True,
        }
        message = json.dumps(data)
        self.producer.send(filename, message.encode("utf-8"))
        self.producer.flush()

        print("Sent response to topic: " + filename, flush=True)

    # Deprecated. Remove this
    def deprecated_jsonl_treatment(self, filename, extension):
        data_treatment_service = DeprecatedDataTreatmentService()
        file_manager = FileManager()
        content = file_manager.data_treatment_to_jsonl(data_treatment_service,
                                                       filename, extension)

        producer = KafkaProducer(bootstrap_servers=[KAFKA_BROKER_ADDRESS])
        data = {"information": filename, "success": True}
        message = json.dumps(data)
        producer.send(filename, message.encode("utf-8"))
        producer.flush()

        print("Sent response to topic: " + filename, flush=True)
