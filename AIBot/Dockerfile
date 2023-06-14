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

WORKDIR /usr/aibot
COPY . /usr/aibot
COPY .env .
VOLUME ["file-storage:/usr/aibot/file-storage"]

RUN pip install --no-cache-dir -r requirements.txt && python -m spacy download en_core_web_lg && python -m spacy download pt_core_news_lg

CMD ["python", "src/__init__.py"]