import fitz
import openai
import chromadb
import uuid

# Initialize clients
chroma_client = chromadb.PersistentClient(path="chroma_db")
collection = chroma_client.get_or_create_collection(name="pdf_collection")

def process_and_index_pdf(pdf_stream):
    """
    Reads a PDF from a byte stream, processes it, and indexes it in ChromaDB.
    """
    try:
        pdf_id = str(uuid.uuid4())
        collection = chroma_client.create_collection(name=pdf_id)
        
        pdf_document = fitz.open(stream=pdf_stream, filetype="pdf")
        
        chunks = []
        for page_num in range(len(pdf_document)):
            page = pdf_document.load_page(page_num)
            text = page.get_text("text")
            paragraphs = text.split('\n\n')
            for para in paragraphs:
                if len(para.strip()) > 50:
                    chunks.append({"text": para.strip(), "page_number": page_num + 1})

        if not chunks:
            return {"status": "error", "message": "Could not extract any text from the PDF."}

        chunk_texts = [chunk['text'] for chunk in chunks]
        response = openai.embeddings.create(input=chunk_texts, model="text-embedding-ada-002")
        embeddings = [embedding.embedding for embedding in response.data]
        
        ids = [f"chunk_{i}" for i in range(len(chunks))]
        metadatas = [{"page": chunk['page_number']} for chunk in chunks]
        
        collection.add(embeddings=embeddings, documents=chunk_texts, metadatas=metadatas, ids=ids)
        
        return {"status": "success", "message": f"Successfully indexed {len(chunks)} chunks.", "pdf_id": pdf_id}
    except Exception as e:
        print(f"An error occurred in upload_service.py: {e}")
        return {"status": "error", "message": str(e)}