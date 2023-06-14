from flask import Blueprint, request, jsonify
from controllers.embeddings_controller import EmbeddingsController
embeddings_bp = Blueprint('embeddings', __name__)

embedding_controller = EmbeddingsController()


@embeddings_bp.route('/generate/hugging-face',  methods=['POST'])
def generate_embeddings():
    response_dto = embedding_controller.embed_dataset_hugging_face()

    return response_dto.get_body(), response_dto.get_status_code()


@embeddings_bp.route('/query/hugging-face',  methods=['POST'])
def extract_document_information():
    request_data = request.get_json()
    response_dto = embedding_controller.query_for_topic_hugging_face(request_data)

    return response_dto.get_body(), response_dto.get_status_code()


#Main
@embeddings_bp.route('/generate',  methods=['POST'])
def embed_using_faiss():
    response_dto = embedding_controller.embed_using_faiss()

    return response_dto.get_body(), response_dto.get_status_code()

#Main
@embeddings_bp.route('/query',  methods=['POST'])
def query_using_faiss():
    request_data = request.get_json()
    response_dto = embedding_controller.query_using_faiss(request_data)

    return jsonify(response_dto.get_body()), response_dto.get_status_code()
