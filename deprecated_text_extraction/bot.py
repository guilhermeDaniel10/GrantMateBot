import logging
import os
from File.Services.DataTreatmentService import DataTreatmentService

from dotenv import load_dotenv
from kafka.admin import KafkaAdminClient, NewTopic
from kafka.errors import TopicAlreadyExistsError
from kafkaClient.Services.KafkaConsumerService import KafkaConsumerService


load_dotenv()
KAFKA_PYTHON_ID = os.getenv("KAFKA_PYTHON_ID")
KAFKA_BROKER_ADDRESS = os.getenv("KAFKA_BROKER_ADDRESS")
KAFKA_GROUP = os.getenv("KAFKA_GROUP")
KAFKA_TEST_TOPIC = os.getenv("KAFKA_TEST_TOPIC")
KAFKA_FILE_UPLOAD = os.getenv("KAFKA_FILE_UPLOAD")
KAFKA_FILE_TRAIN_SUCCESS = os.getenv("KAFKA_FILE_TRAIN_SUCCESS")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s",
    handlers=[logging.StreamHandler()],
)

logger = logging.getLogger(__name__)


def main():
    logger.info("Started the GPTBot")

    # Create a KafkaAdminClient instance
    admin_client = KafkaAdminClient(
        bootstrap_servers=[KAFKA_BROKER_ADDRESS], client_id=KAFKA_PYTHON_ID
    )

    # Define the properties of the new topic you want to create
    file_upload_topic_name = KAFKA_FILE_UPLOAD
    file_train_success_topic_name = KAFKA_FILE_TRAIN_SUCCESS
    num_partitions = 3
    replication_factor = 1

    # Create a NewTopic instance with the topic properties
    file_upload_topic = NewTopic(
        name=file_upload_topic_name,
        num_partitions=num_partitions,
        replication_factor=replication_factor,
    )
    '''file_train_sucess_topic = NewTopic(
        name=file_train_success_topic_name,
        num_partitions=num_partitions,
        replication_factor=replication_factor,
    )'''
    try:
        # Create the new topic using the KafkaAdminClient API
        admin_client.create_topics(
            new_topics=[file_upload_topic] #file_train_sucess_topic
        )
    except TopicAlreadyExistsError:
        # Log a message indicating that the topic already exists
        logger.info(f"Topic already exists")

    consumer_service = KafkaConsumerService(KAFKA_BROKER_ADDRESS, file_upload_topic_name)
    consumer_service.start()

    logger.info("Ended")


if __name__ == "__main__":
    main()
