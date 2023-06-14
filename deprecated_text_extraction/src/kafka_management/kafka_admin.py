import logging
import os

from dotenv import load_dotenv
from kafka.admin import KafkaAdminClient, NewTopic
from kafka.errors import TopicAlreadyExistsError
from kafka_management.kafka_constants import KAFKA_BROKER_ADDRESS, KAFKA_EMBED_REDO, KAFKA_FILE_TRAIN_SUCCESS, KAFKA_FILE_UPLOAD, KAFKA_GENERATE_TEXT_VIA_PROMPT, KAFKA_PYTHON_ID, KAFKA_TEST_TOPIC, KAFKA_TOPIC_SEARCH, KAFKA_TOPIC_SEARCH_RESPONSE

load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s",
    handlers=[logging.StreamHandler()],
)

logger = logging.getLogger(__name__)


class KafkaAdmin:

    def __init__(self):
        # Create a KafkaAdminClient instance
        self.admin_client = KafkaAdminClient(
            bootstrap_servers=[KAFKA_BROKER_ADDRESS],
            client_id=KAFKA_PYTHON_ID)

    def instantiate_topics(self):
        self.create_topic(KAFKA_TEST_TOPIC)
        self.create_topic(KAFKA_FILE_UPLOAD)
        self.create_topic(KAFKA_GENERATE_TEXT_VIA_PROMPT)
        self.create_topic(KAFKA_FILE_TRAIN_SUCCESS)
        self.create_topic(KAFKA_TOPIC_SEARCH)
        self.create_topic(KAFKA_TOPIC_SEARCH_RESPONSE)
        self.create_topic(KAFKA_EMBED_REDO)

    def create_topic(self, topic_name):
        # Define the properties of the new topic you want to create
        num_partitions = 3
        replication_factor = 1

        # Create a NewTopic instance with the topic properties
        topic = NewTopic(
            name=topic_name,
            num_partitions=num_partitions,
            replication_factor=replication_factor,
        )

        try:
            # Create the new topic using the KafkaAdminClient API
            self.admin_client.create_topics(new_topics=[topic])
        except TopicAlreadyExistsError:
            # Log a message indicating that the topic already exists
            logger.info("Topic already exists")
