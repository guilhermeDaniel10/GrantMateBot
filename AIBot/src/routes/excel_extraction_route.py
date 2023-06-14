from flask import Blueprint, request, jsonify
from controllers.excel_extraction_controller import ExcelExtractionController

excel_extraction_bp = Blueprint('excel_extraction', __name__)

excel_extraction_controller = ExcelExtractionController()


@excel_extraction_bp.route('/',  methods=['POST'])
def save_excel_document():
    request_file = request.files['file']
    response_dto = excel_extraction_controller.save_excel_file(
        request_file)

    return response_dto.get_body(), response_dto.get_status_code()


@excel_extraction_bp.route('/process/',  methods=['POST'])
def process_excel_document():
    request_file = request.files['file']
    response_dto = excel_extraction_controller.process_excel_file(
        request_file)

    return response_dto.get_body(), response_dto.get_status_code()
