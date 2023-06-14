#!/bin/bash

# Enter the Kafka container
docker exec -it kafka /bin/bash

# Set the bootstrap server address
BOOTSTRAP_SERVER=localhost:9092

# Get a list of topics
TOPICS=$(kafka-topics.sh --bootstrap-server $BOOTSTRAP_SERVER --list)

# Loop through each topic
for TOPIC in $TOPICS; do
  # Check if the topic name ends with ".pdf", ".txt", ".doc", or ".docs"
  if [[ "$TOPIC" == *".pdf" || "$TOPIC" == *".txt" || "$TOPIC" == *".doc" || "$TOPIC" == *".docs" ]]; then
    # Delete the topic
    kafka-topics.sh --bootstrap-server $BOOTSTRAP_SERVER --delete --topic $TOPIC
    echo "Deleted topic: $TOPIC"
  fi
done