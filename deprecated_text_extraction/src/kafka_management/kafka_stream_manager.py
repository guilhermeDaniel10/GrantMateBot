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
        self.data_treatment_manager = DataTreatmentManager()

    def stream_type_manager(self, stream_message):
        stream_message = stream_message.value

        print(stream_message, flush=True)
        stream_type = stream_message["streamType"]
        payload = stream_message["payload"]

        # TODO: DO SINGLE EMBEDDING WITHOUT UPLOADING A FILE
        print(stream_type, flush=True)

        if "FILE_UPLOAD" in stream_type:
            print("\033[93m DOING EMBEDDINGS", flush=True)

            filename = payload["filename"]
            extension = payload["extension"]
            title_format = payload["titleFormat"]
            is_bold = title_format["bold"]
            is_caps = title_format["caps"]
            color = title_format["color"]

            file_content = self.file_manager.read_file(filename, extension)

            self.file_manager.save_content_as_txt(filename, file_content)
            self.data_treatment_manager.extract_data_from_document_with_parameters(
                filename, ['EUROSTARS', 'Aim higher', 'APPLICATION FORM'],
                is_caps, is_bold, [color], False)
            self.model_manager.embed_dataset()

        elif "GENERATE_TEXT_VIA_PROMPT" in stream_type:
            #TODO: Fill the function
            print("\033[93m GENERATING TEXT", flush=True)

        elif "TOPIC_SEARCH" in stream_type:
            print("RECEIVED A TOPIC SEARCH MESSAGE", flush=True)

            topic_to_query = payload["topic"]
            number_of_topics = payload["numberOfTopics"]
            query_result_as_json = self.model_manager.query_for_topic(
                topic_to_query, number_of_topics)
            self.generic_success_information("KAFKA_TOPIC_SEARCH_RESPONSE",
                                             payload["correlation_id"],
                                             query_result_as_json)
        elif "KAFKA_EMBED_REDO" in stream_type:
            print("RECEIVED A REDO EMBEDDING MESSAGE", flush=True)
            self.model_manager.embed_dataset()

    def generic_success_information(self, topic, correlation_id, payload):
        data = {
            "success": True,
            "correlation_id": correlation_id,
            "information": payload
        }
        message = json.dumps(data)
        self.producer.send(topic, message.encode("utf-8"))
        self.producer.flush()

        print("Sent response to topic: " + topic, flush=True)
