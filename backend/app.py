import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS

from services.upload_service import process_and_index_pdf
from services.chat_service import get_chat_response
from services.document_service import delete_document_data

load_dotenv()
app = Flask(__name__)
CORS(app)

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "This is a backend for NotebookLM Clone, developed by Akshaykumar Lilani (https://akshaylilani.com)"
    }), 200

@app.route("/upload", methods=['POST'])
def upload_pdf():
    if 'file' not in request.files: return jsonify({"error": "No file"}), 400
    file = request.files['file']
    
    if file.filename == '' or not file.filename.endswith('.pdf'): return jsonify({"error": "Invalid or no file selected"}), 400

    pdf_stream = file.read()
    result = process_and_index_pdf(pdf_stream, file.filename)

    if result["status"] == "success":
        return jsonify({"message": result["message"], "pdf_id": result["pdf_id"]}), 200
    else:
        return jsonify({"error": result["message"]}), 500


@app.route("/chat", methods=['POST'])
def chat_with_pdf():
    data = request.get_json()
    user_question = data.get('question')
    pdf_id = data.get('pdf_id')
    previous_conversation = data.get("previous_conversation", None)
    
    if not all([user_question, pdf_id]):
        return jsonify({"error": "Missing 'question' or 'pdf_id'"}), 400
    
    if previous_conversation is None or not isinstance(previous_conversation, list):
        previous_conversation = []
    
    result = get_chat_response(user_question, pdf_id, previous_conversation)

    if result["status"] == "success":
        return jsonify({
            "answer": result["answer"], 
            "citations": result["citations"],
            "sources": result["sources"] # <-- ADD THIS
        }), 200
    else:
        return jsonify({"error": result["message"]}), 500

@app.route("/delete", methods=['POST'])
def delete_pdf_data():
    """
    Endpoint to delete all data associated with a specific pdf_id.
    """
    data = request.get_json()
    pdf_id = data.get('pdf_id')

    if not pdf_id:
        return jsonify({"error": "Missing 'pdf_id'"}), 400
    
    result = delete_document_data(pdf_id)

    if result["status"] == "success":
        return jsonify({"message": result["message"]}), 200
    else:
        return jsonify({"error": result["message"]}), 500
