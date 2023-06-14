import logging
import json
from dotenv import load_dotenv
from kafka import KafkaConsumer
from kafka import KafkaProducer
from kafka_management.kafka_stream_manager import KafkaStreamManager

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s",
    handlers=[logging.StreamHandler()],
)
logger = logging.getLogger(__name__)


class KafkaClient:
    def __init__(self, broker_address, topic):
        self.consumer = KafkaConsumer(
            topic,
            bootstrap_servers=[broker_address],
            value_deserializer=lambda m: json.loads(m.decode("utf-8")),
        )
        self.stream_manager = KafkaStreamManager()

    def start_consumer_message_receive(self):
        for message in self.consumer:
            self.stream_manager.stream_type_manager(message)
