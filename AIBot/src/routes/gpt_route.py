from flask import Blueprint, request
from controllers.gpt_controller import GptController
gpt_bp = Blueprint('gpt', __name__)

gpt_controller = GptController()


@gpt_bp.route('/generate-text',  methods=['POST'])
def generate_text():
    request_data = request.get_json()
    response_dto = gpt_controller.generate_text(request_data)

    return response_dto.get_body(), response_dto.get_status_code()
