from flask import Blueprint, request
from controllers.document_extraction_controller import DocumentBasedExtractionController
document_extraction_bp = Blueprint('document_extraction', __name__)

document_extraction_controller = DocumentBasedExtractionController()


@document_extraction_bp.route('/structure',  methods=['POST'])
def extract_document_information():
    request_data = request.get_json()
    response_dto = document_extraction_controller.extract_document_information(
        request_data)

    return response_dto.get_body(), response_dto.get_status_code()


@document_extraction_bp.route('/alternative',  methods=['POST'])
def extract_document_chunk_information():
    request_data = request.get_json()
    response_dto = document_extraction_controller.extract_document_information_alternative(
        request_data)

    return response_dto.get_body(), response_dto.get_status_code()


@document_extraction_bp.route('/pdf-structure',  methods=['POST'])
def extract_document_information_using_pdfstructure():
    print("IS HERE", flush=True)
    request_data = request.get_json()
    response_dto = document_extraction_controller.extract_document_using_pdfstructure(
        request_data)

    return response_dto.get_body(), response_dto.get_status_code()


@document_extraction_bp.route('/text-file',  methods=['POST'])
def extract_document_information_to_text():
    request_data = request.get_json()
    response_dto = document_extraction_controller.extract_document_to_txt(
        request_data)

    return response_dto.get_body(), response_dto.get_status_code()


@document_extraction_bp.route('/structure',  methods=['GET'])
def get_structured_dataframe_data():
    response_dto = document_extraction_controller.get_structured_dataframe_data()

    return response_dto.get_body(), response_dto.get_status_code()
