import tiktoken
from llama_cloud_services import LlamaParse
from langchain.text_splitter import RecursiveCharacterTextSplitter
import openai
import chromadb
import uuid
from services.constants import CHROMA_DB_PATH, EMBEDDING_MODEL, CHAT_COMPLETION_MODEL, MAX_TOKENS_ALLOWED_FOR_EMBEDDING

def num_tokens_from_string(string: str) -> int:
    """Returns the number of tokens in a text string."""
    encoding = tiktoken.encoding_for_model(CHAT_COMPLETION_MODEL)
    num_tokens = len(encoding.encode(string))
    return num_tokens

def process_and_index_pdf(pdf_stream, filename):
    """
    Reads a PDF from a byte stream, processes it, and indexes it in ChromaDB.
    """
    try:
        pdf_id = str(uuid.uuid4())

        chroma_client = chromadb.PersistentClient(path=CHROMA_DB_PATH)
        collection = chroma_client.get_or_create_collection(name=pdf_id)

        llama_parser = LlamaParse(verbose=True)
        result = llama_parser.parse(pdf_stream, {"file_name": filename})
        markdown_documents = result.get_markdown_documents(split_by_page=True)

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=150,
            chunk_overlap=20,
            separators=["\n\n", "\n", ". ", " ", ""] # Order of separators
        )
        
        chunks = []
        for page in markdown_documents:
            text = page.text
            _chunks = text_splitter.split_text(text)
            for _ch in _chunks:
                if len(_ch.strip()) > 1:
                    chunks.append({"text": _ch.strip(), "page_number": page.extra_info['page_number']})

        if not chunks:
            return {
                "status": "error",
                "message": "Could not extract any text from the PDF.",
            }

        chunk_texts = []
        for chunk in chunks:
            if len(chunk["text"]) > 0:
                chunk_texts.append(chunk["text"])
        
        total_token_count = 0
        for chunk_text in chunk_texts:
            total_token_count += num_tokens_from_string(chunk_text)
        
        if total_token_count > MAX_TOKENS_ALLOWED_FOR_EMBEDDING:
            return {
                "status": "error",
                "message": "PDF Too large"
            }
        
        response = openai.embeddings.create(input=chunk_texts, model=EMBEDDING_MODEL)
        embeddings = [embedding.embedding for embedding in response.data]

        ids = [f"chunk_{i}" for i in range(len(chunks))]
        metadatas = [{"page": chunk["page_number"]} for chunk in chunks]

        collection.add(
            embeddings=embeddings, documents=chunk_texts, metadatas=metadatas, ids=ids
        )

        return {
            "status": "success",
            "message": f"Successfully indexed {len(chunks)} chunks.",
            "pdf_id": pdf_id,
        }
    except Exception as e:
        print(f"An error occurred in upload_service.py: {e}")
        return {"status": "error", "message": str(e)}
