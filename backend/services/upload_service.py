import tiktoken
from llama_cloud_services import LlamaParse
from langchain.text_splitter import RecursiveCharacterTextSplitter
import openai
import chromadb
# import uuid
from services.constants import CHROMA_DB_PATH, EMBEDDING_MODEL, CHAT_COMPLETION_MODEL, MAX_TOKENS_ALLOWED_FOR_EMBEDDING
from typing import List, Dict

def num_tokens_from_string(string: str) -> int:
    """Returns the number of tokens in a text string."""
    encoding = tiktoken.encoding_for_model(CHAT_COMPLETION_MODEL)
    num_tokens = len(encoding.encode(string))
    return num_tokens

def process_and_index_pdf(pdf_stream, filename, pdf_id):
    """
    Reads a PDF from a byte stream, processes it, and indexes it in ChromaDB.
    """
    try:
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
        
        # Get a few relevant questions
        relevant_questions: List[str] = []
        try:
            # Choose the first 12 chunks as context
            top_chunks = chunks[:12]
            # Prepare system and user prompts
            system_prompt = (
                "You are an AI assistant that generates user-friendly questions based on document excerpts."
            )
            excerpts = "\n\n".join(chunk['text'] for chunk in top_chunks)
            user_prompt = f"""
    **Context Excerpts:**
    ---
    {excerpts}

    **Task:**
    Based on the above excerpts from the PDF, generate 5-7 clear, open-ended questions that a reader might ask to explore the document's content further.
    """
            # Call the chat completion API
            response = openai.chat.completions.create(
                model=CHAT_COMPLETION_MODEL,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ]
            )
            # Extract and parse the assistant's reply into a list of questions
            reply = response.choices[0].message.content
            for line in reply.splitlines():
                text = line.strip()
                if not text:
                    continue
                # Remove bullets or numbering
                question = text.lstrip("-•0123456789. ")
                relevant_questions.append(question)
        except Exception as e:
            print(f"Error generating relevant questions: {e}")
            # Fallback to empty list (or defaults)
            relevant_questions = []

        return {
            "status": "success",
            "message": f"Successfully indexed {len(chunks)} chunks.",
            "pdf_id": pdf_id,
            "relevant_questions": relevant_questions
        }
    except Exception as e:
        print(f"An error occurred in upload_service.py: {e}")
        return {"status": "error", "message": str(e)}
