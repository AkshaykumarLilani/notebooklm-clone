import chromadb
from services.constants import CHROMA_DB_PATH

def delete_document_data(pdf_id: str):
    """
    Deletes the entire collection associated with a given pdf_id from ChromaDB.
    """
    try:
        chroma_client = chromadb.PersistentClient(path=CHROMA_DB_PATH)
        chroma_client.delete_collection(name=pdf_id)
        return {"status": "success", "message": f"Data for PDF ID '{pdf_id}' has been deleted."}
    except ValueError as e:
        print(f"Attempted to delete a non-existent collection: {e}")
        return {"status": "success", "message": f"No data found for PDF ID '{pdf_id}'."}
    except Exception as e:
        print(f"An error occurred in document_service.py: {e}")
        return {"status": "error", "message": "An unexpected error occurred during deletion."}