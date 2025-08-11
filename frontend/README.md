# NotebookLM Clone Frontend

This is the frontend for a clone of NotebookLM, a tool for interacting with your documents.

## Features

*   **Upload PDF:** Upload a PDF file to the application.
*   **Chat with your PDF:** Ask questions about the content of your PDF and get answers from an AI model.
*   **Relevant Questions:** After uploading a PDF, the application will automatically generate a list of relevant questions to help you get started.

## Getting Started

### Prerequisites

*   Node.js and npm installed on your machine.
*   A running instance of the backend service.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/notebooklm-clone.git
    ```
2.  Install the dependencies:
    ```bash
    cd frontend
    npm install
    ```
3.  Create a `.env.local` file by copying the `.env.sample` file and add the following environment variable:
    ```
    NEXT_PUBLIC_API_URL=http://localhost:5000
    ```
4.  Run the development server:
    ```bash
    npm run dev
    ```

## Backend

The backend for this project is located in the `backend` directory. Please refer to the `backend/README.md` for instructions on how to set up and run the backend.
