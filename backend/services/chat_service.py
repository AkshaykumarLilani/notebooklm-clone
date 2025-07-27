import openai
import chromadb
from services.constants import CHROMA_DB_PATH, PDF_COLLECTION_NAME

def get_chat_response(question: str, pdf_id: str):
    """
    Takes a user question, finds relevant context from the DB, and generates a response.
    """
    
    chroma_client = chromadb.PersistentClient(path=CHROMA_DB_PATH)
    pdf_collection = chroma_client.get_or_create_collection(name=PDF_COLLECTION_NAME)
    
    try:
        try:
            collection = chroma_client.get_collection(name=pdf_id)
        except ValueError:
            return {"status": "error", "message": "PDF session not found. Please upload the document again."}

        response = openai.embeddings.create(input=[question], model="text-embedding-ada-002")
        query_embedding = response.data[0].embedding
        
        results = collection.query(query_embeddings=[query_embedding], n_results=3)
        
        context_chunks = results['documents'][0]
        context_metadatas = results['metadatas'][0]
        context = "\n\n---\n\n".join(context_chunks)

        prompt = f"""
        Answer the user's question based only on the following context:
        Context:
        {context}
        Question: {question}
        """
        
        chat_completion = openai.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a helpful assistant of the user. your job is to understand the context given by user and answer their questions professionally"},
                {"role": "user", "content": prompt},
            ],
            model="gpt-3.5-turbo",
        )
        answer = chat_completion.choices[0].message.content
        
        sources = [
            # {"page": meta['page'], "text": doc} 
            # for meta, doc in zip(context_metadatas, context_chunks)
        ]
        
        citation_pages = sorted(list(set(meta['page'] for meta in context_metadatas)))
        

        return {
            "status": "success", 
            "answer": answer, 
            "citations": citation_pages,
            "sources": sources
        }

    except Exception as e:
        print(f"An error occurred in chat_service.py: {e}")
        return {"status": "error", "message": "Failed to generate a response."}