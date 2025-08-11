import os
import uuid
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask import send_from_directory
from services.constants import PDFS_DIRECTORY

from services.upload_service import process_and_index_pdf
from services.chat_service import get_chat_response
from services.document_service import delete_document_data
from services.history_service import load_chat_history, append_to_chat_history

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

    # pdfs_dir = os.path.join(os.path.dirname(__file__), PDFS_DIRECTORY)
    # os.makedirs(pdfs_dir, exist_ok=True)
    
    pdf_id = str(uuid.uuid4())
    stored_filename = f"{pdf_id}_{file.filename}"
    # stored_path = os.path.join(pdfs_dir, stored_filename)

    # Save PDF file to disk
    # file.seek(0)
    # file.save(stored_path)

    # Read file content for processing (llama_parse expects bytes)
    # with open(stored_path, "rb") as f:
    #     pdf_stream = f.read()
    
    pdf_stream = file.read()
    result = process_and_index_pdf(pdf_stream, file.filename, pdf_id)

    if result["status"] == "success":
        return jsonify({"message": result["message"], "pdf_id": result["pdf_id"], "relevant_questions": result['relevant_questions'], "pdf_file": stored_filename}), 200
    else:
        # try:
        #     if os.path.exists(stored_path):
        #         os.remove(stored_path)
        # except Exception as e:
        #     print(f"Failed to remove PDF after error: {e}")
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
        # append_to_chat_history(pdf_id, user_question, result["answer"])
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
    
    pdfs_dir = os.path.join(os.path.dirname(__file__), PDFS_DIRECTORY)
    removed = False
    if os.path.exists(pdfs_dir):
        for fname in os.listdir(pdfs_dir):
            if fname.startswith(f"{pdf_id}_"):
                try:
                    os.remove(os.path.join(pdfs_dir, fname))
                    removed = True
                except Exception as e:
                    print(f"Failed to remove {fname}: {e}")
    
    result = delete_document_data(pdf_id)

    if result["status"] == "success":
        msg = result["message"]
        if removed:
            msg += " (PDF file deleted)"
        return jsonify({"message": msg}), 200
    else:
        return jsonify({"error": result["message"]}), 500

@app.route("/get_pdf", methods=["GET"])
def get_pdf():
    pdf_id = request.args.get("pdf_id")
    if not pdf_id:
        return jsonify({"error": "Missing 'pdf_id'"}), 400

    pdfs_dir = os.path.join(os.path.dirname(__file__), PDFS_DIRECTORY)
    if not os.path.exists(pdfs_dir):
        return jsonify({"error": "No PDFs found"}), 404

    # Look for any file starting with pdf_id_
    matched_files = [fname for fname in os.listdir(pdfs_dir) if fname.startswith(f"{pdf_id}_")]
    if not matched_files:
        return jsonify({"error": "PDF not found"}), 404

    # Take the first match (should only be one per id)
    filename = matched_files[0]
    return send_from_directory(pdfs_dir, filename, as_attachment=True)

@app.route("/chat_history", methods=["GET"])
def get_chat_history():
    pdf_id = request.args.get("pdf_id")
    if not pdf_id:
        return jsonify({"error": "Missing 'pdf_id'"}), 400
    history = load_chat_history(pdf_id)
    return jsonify({"pdf_id": pdf_id, "history": history}), 200


@app.route("/pdfs", methods=["GET"])
def list_pdfs():
    pdfs_dir = os.path.join(os.path.dirname(__file__), PDFS_DIRECTORY)
    if not os.path.exists(pdfs_dir):
        return jsonify([]), 200

    result = []
    for fname in os.listdir(pdfs_dir):
        if fname.endswith(".pdf") and "_" in fname:
            pdf_id = fname.split("_")[0]
            file_path = os.path.join(pdfs_dir, fname)
            uploaded_at = os.path.getctime(file_path)
            result.append({
                "pdf_id": pdf_id,
                "filename": fname,
                "uploaded_at": uploaded_at
            })
    return jsonify(result), 200
