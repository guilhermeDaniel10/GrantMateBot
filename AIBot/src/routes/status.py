from flask import Blueprint, jsonify
status_bp = Blueprint('status', __name__)

@status_bp.route('',  methods=['GET'])
def current_status():
    return jsonify({'status':'running'})