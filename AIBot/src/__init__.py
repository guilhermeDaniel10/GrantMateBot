from flask import Flask
from routes.test import test_bp
from routes.status import status_bp
from routes.document_extraction_route import document_extraction_bp
from routes.embedding_route import embeddings_bp
from routes.gpt_route import gpt_bp
from routes.language_route import language_bp
from routes.keyword_route import keyword_bp
from routes.summarize_route import summarize_bp
from routes.excel_extraction_route import excel_extraction_bp


def create_app():
    app = Flask(__name__)
    app.register_blueprint(test_bp, url_prefix='/test')
    app.register_blueprint(status_bp, url_prefix='/status')
    app.register_blueprint(document_extraction_bp, url_prefix='/extraction')
    app.register_blueprint(embeddings_bp, url_prefix='/embeddings')
    app.register_blueprint(gpt_bp, url_prefix='/gpt')
    app.register_blueprint(language_bp, url_prefix='/language')
    app.register_blueprint(keyword_bp, url_prefix='/keywords')
    app.register_blueprint(summarize_bp, url_prefix='/summarize')
    app.register_blueprint(excel_extraction_bp, url_prefix='/excel')

    return app


if __name__ == '__main__':
    print("RUNNING", flush=True)
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
    print("TESTE", flush=True)
    print("TESTE", flush=True)
