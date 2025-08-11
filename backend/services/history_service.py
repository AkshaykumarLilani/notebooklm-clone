import os
import json

CHAT_HISTORY_DIR = "chat_history"

def ensure_history_dir():
    if not os.path.exists(CHAT_HISTORY_DIR):
        os.makedirs(CHAT_HISTORY_DIR)

def get_history_path(pdf_id):
    ensure_history_dir()
    return os.path.join(CHAT_HISTORY_DIR, f"{pdf_id}.json")

def load_chat_history(pdf_id):
    path = get_history_path(pdf_id)
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    else:
        return []

def save_chat_history(pdf_id, history):
    path = get_history_path(pdf_id)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(history, f, ensure_ascii=False, indent=2)

def append_to_chat_history(pdf_id, user_msg, assistant_msg):
    history = load_chat_history(pdf_id)
    history.append({"role": "user", "content": user_msg})
    history.append({"role": "assistant", "content": assistant_msg})
    save_chat_history(pdf_id, history)
