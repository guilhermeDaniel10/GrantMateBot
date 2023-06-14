FROM python:3.11-slim-buster

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    git \
    cmake \
    && rm -rf /var/lib/apt/lists/*

RUN git clone https://github.com/google/sentencepiece.git && \
    cd sentencepiece && \
    mkdir build && \
    cd build && \
    cmake .. && \
    make && \
    make install && \
    cd ../.. && \
    rm -rf sentencepiece

# Set the working directory to /app
WORKDIR /usr/bot

# Copy the current directory contents into the container at /app
COPY . /usr/bot

COPY .env .

# Use the existing "file-storage" volume for accessing files
VOLUME ["file-storage:/usr/bot/file-storage"]

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt && python -m spacy download en_core_web_lg

# Add a script to wait for the database
ADD https://github.com/vishnubob/wait-for-it/raw/master/wait-for-it.sh /wait-for-it.sh
# Set the permissions for the script
RUN chmod +x /wait-for-it.sh


# Run the command to start the API
CMD /wait-for-it.sh kafka:9092 --timeout=30 -- sh -c 'python src/ai_bot.py'
