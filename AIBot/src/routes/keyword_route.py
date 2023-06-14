from flask import Blueprint, jsonify, request
from controllers.keyword_controller import KeywordController
keyword_bp = Blueprint('keyword', __name__)

keyword_controller = KeywordController()


@keyword_bp.route('/structure',  methods=['POST'])
def get_keywords_from_structure():
    request_data = request.get_json()
    response_dto = keyword_controller.get_keywords_from_section_structure_by_request(
        request_data)

    return response_dto.get_body(), response_dto.get_status_code()


@keyword_bp.route('/structure-file',  methods=['POST'])
def merge_keywords_to_structure_dataframe():
    response_dto = keyword_controller.merge_keywords_to_structure_dataframe()

    return response_dto.get_body(), response_dto.get_status_code()

