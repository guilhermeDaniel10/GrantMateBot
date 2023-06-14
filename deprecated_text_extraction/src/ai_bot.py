import os
import logging
import threading

from kafka_management.kafka_client import KafkaClient
from kafka_management.kafka_admin import KafkaAdmin
from kafka_management.kafka_constants import KAFKA_TOPIC_SEARCH
from kafka_management.kafka_constants import KAFKA_BROKER_ADDRESS, KAFKA_FILE_UPLOAD, KAFKA_GENERATE_TEXT_VIA_PROMPT, KAFKA_EMBED_REDO

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s",
    handlers=[logging.StreamHandler()],
)

logger = logging.getLogger(__name__)


def main():
    logger.info("Started the AI BOT")

    admin_client = KafkaAdmin()
    admin_client.instantiate_topics()

    kafka_consumer_thread(KAFKA_BROKER_ADDRESS, KAFKA_FILE_UPLOAD)
    kafka_consumer_thread(KAFKA_BROKER_ADDRESS, KAFKA_GENERATE_TEXT_VIA_PROMPT)
    kafka_consumer_thread(KAFKA_BROKER_ADDRESS, KAFKA_TOPIC_SEARCH)
    kafka_consumer_thread(KAFKA_BROKER_ADDRESS, KAFKA_EMBED_REDO)


def kafka_consumer_thread(broker_address, topic):
    kafka_client = threading.Thread(target=KafkaClient(
        broker_address, topic).start_consumer_message_receive)
    kafka_client.start()


if __name__ == "__main__":
    main()
