from flask import Blueprint, jsonify, request
from controllers.summarize_controller import SummarizeController
summarize_bp = Blueprint('summarize', __name__)

summarize_controller = SummarizeController()


@summarize_bp.route('/text',  methods=['POST'])
def summarize_text():
    request_data = request.get_json()
    response_dto = summarize_controller.summarize(request_data)

    return response_dto.get_body(), response_dto.get_status_code()


@summarize_bp.route('/transformer',  methods=['POST'])
def summarize_text_transformer():
    request_data = request.get_json()
    response_dto = summarize_controller.summarize_transformers(request_data)

    return response_dto.get_body(), response_dto.get_status_code()
