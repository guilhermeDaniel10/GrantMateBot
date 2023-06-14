from flask import Blueprint, jsonify, request
from controllers.language_controller import LanguageController
language_bp = Blueprint('language', __name__)

language_controller = LanguageController()

@language_bp.route('/detect',  methods=['POST'])
def detect_text_language():
    request_data = request.get_json()
    response_dto = language_controller.detect_language_by_request(request_data, 1000)

    return response_dto.get_body(), response_dto.get_status_code()
