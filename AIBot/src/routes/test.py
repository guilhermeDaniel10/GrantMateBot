from flask import Blueprint
test_bp = Blueprint('test', __name__)

@test_bp.route('',  methods=['GET'])
def hello():
    return "AIBot is running!"
