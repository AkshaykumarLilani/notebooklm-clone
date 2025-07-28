import openai
import chromadb
from services.constants import CHROMA_DB_PATH, EMBEDDING_MODEL, CHAT_COMPLETION_MODEL

def get_chat_response(question: str, pdf_id: str, previous_conversation: list):
    """
    Takes a user question, 
    finds relevant context from the DB, 
    and generates a response.
    """
    try:
        try:
            chroma_client = chromadb.PersistentClient(path=CHROMA_DB_PATH)
            collection = chroma_client.get_collection(name=pdf_id)
        except ValueError:
            return {"status": "error", "message": "PDF session not found. Please upload the document again."}

        response = openai.embeddings.create(input=[question], model=EMBEDDING_MODEL)
        query_embedding = response.data[0].embedding
        
        results = collection.query(query_embeddings=[query_embedding], n_results=10)
        
        context_chunks = results['documents'][0]
        context_metadatas = results['metadatas'][0]
        context = "\n\n---\n\n".join(context_chunks)
        
        system_prompt = """
            You are a highly intelligent and helpful AI assistant for a document analysis application.
            Your task is to answer the user's questions based *exclusively* on the provided context.
            - Analyze the context provided in the user's message.
            - Formulate a clear and concise answer to the user's question using only the information from that context.
            - If the answer cannot be found in the context, you must state that clearly. For example, you can say, "Based on the provided documents, I couldn't find an answer to that question."
            - Do not use any of your own external knowledge.
            - Be polite, professional, and conversational.
        """
        
        user_prompt = f"""
        **Context:**
        ---
        {context}
        ---

        **Question:**
        {question}
        """
        
        messages = [
                {"role": "system", "content": system_prompt},
        ]
        for conversation in previous_conversation:
            if "content" in conversation and conversation["content"] is not None:
                messages.append(conversation)
        messages.append({"role": "user", "content": user_prompt})
        
        chat_completion = openai.chat.completions.create(
            messages=messages,
            model=CHAT_COMPLETION_MODEL,
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