import { v4 as uuidv4 } from 'uuid';

export const MESSAGE_TYPES = {
    "USER": "USER",
    "AI": "AI"
}

export class UserMessage {
    constructor(message) {
        this.message = message;
        this.id = uuidv4();
        this.type = MESSAGE_TYPES.USER;
    }

    to_object() {
        return {
            message: this.message,
            loading: this.loading,
            error: this.error,
            id: this.id,
            type: this.type,
        }
    }
}


export class AIMessage {
    constructor(id = null, message = null, citations = null, sources = null, loading = true, error = null) {
        this.message = message;
        this.citations = citations;
        this.sources = sources;
        this.loading = loading;
        this.error = error;

        this.id = id || uuidv4();
        this.type = MESSAGE_TYPES.AI;
    }

    to_object() {
        return {
            message: this.message,
            loading: this.loading,
            error: this.error,
            id: this.id,
            type: this.type,
        }
    }
}

export const scrollAiAnswerIdIntoView = (ai_answer_id) => {
    if (ai_answer_id) {
        const documentEl = document.getElementById(ai_answer_id);
        if (documentEl) {
            documentEl.scrollIntoView({ behavior: "smooth", inline: "start", block: "start" })
        }
    }
}