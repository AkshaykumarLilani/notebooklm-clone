# NotebookLM Clone

This project is a clone of Google's NotebookLM, designed to help users interact with their documents using AI. It consists of a Python Flask backend and a Next.js frontend.

## Features

- **Document Upload:** Upload PDF documents for processing.
- **AI Chat:** Ask questions and get answers based on the content of your uploaded PDFs.
- **Citations:** Get citations from the source documents for the AI-generated answers.

## Technologies Used

### Backend

- **Vector Database:** Chroma DB
- **Embeddings:** OpenAI `text-embedding-ada-002`
- **Language Model:** OpenAI `gpt-3.5-turbo` (for chat completion)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.12+** (for the backend)
- **Node.js 20+** and **npm** (for the frontend)

## Backend Setup

1. **Navigate to the backend directory:**

   ```bash
   cd backend
   ```
2. **Create and activate a virtual environment (recommended):**

   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```
4. **Environment Variables:**

   Create a `.env` file in the `backend/` directory based on `.env.sample`:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

   - `OPENAI_API_KEY`: Your API key from OpenAI. This is crucial for the AI functionalities.
5. **Run the Backend Server:**

   ```bash
   gunicorn --worker-class gevent --workers 1 --bind 0.0.0.0:5000 app:app
   # Or for development with Flask's built-in server:
   # flask run --port 5000
   ```

   The backend server should now be running at `http://localhost:5000` (or your specified port).

## Frontend Setup

1. **Navigate to the frontend directory:**

   ```bash
   cd frontend
   ```
2. **Install dependencies:**

   ```bash
   npm install
   ```
3. **Environment Variables:**

   Create a `.env` file in the `frontend/` directory based on `.env.sample`:

   ```env
   NEXT_PUBLIC_API_URL="http://0.0.0.0:5000"
   ```

   - `NEXT_PUBLIC_API_URL`: The URL of your backend server. Make sure this matches the `PORT` you set for the backend.
4. **Run the Frontend Development Server:**

   ```bash
   npm run dev
   ```

   The frontend application should now be accessible at `http://localhost:3000` (or another port if 3000 is in use).

## Usage

1. Ensure both the backend and frontend servers are running.
2. Open your web browser and navigate to `http://localhost:3000`.
3. Upload a PDF document using the provided interface.
4. Once the document is processed, you can start asking questions related to its content.

## Docker Setup

You can also run the application using Docker.

1. **Build Docker Images:**

   From the project root directory, run:

   ```bash
   docker build -t notebooklm-backend ./backend
   docker build -t notebooklm-frontend ./frontend
   ```
2. **Run Docker Containers:**

   Ensure you have your `.env` files configured in both `backend/` and `frontend/` directories as described above.

   ```bash
   docker run -d -p 5000:5000 --name notebooklm-backend notebooklm-backend
   docker run -d -p 3000:3000 --name notebooklm-frontend notebooklm-frontend
   ```
   The backend will be accessible at `http://localhost:5000` and the frontend at `http://localhost:3000`.
