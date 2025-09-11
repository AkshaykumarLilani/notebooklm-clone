import { v4 as uuidv4 } from 'uuid';
import { AiAnswerIdType } from './context/ChatContext';

export type MESSAGE_TYPES = "USER" | "AI"

export class UserMessage {
    id: string;
    type: MESSAGE_TYPES;
    loading: boolean = false;
    error: STRING_OR_NULL = null;


    constructor(public message: string) {
        this.message = message;
        this.id = uuidv4();
        this.type = 'USER';
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

type STRING_OR_NULL = string | null;


export class AIMessage {
    type: MESSAGE_TYPES;

    constructor(
        public id: STRING_OR_NULL = null,
        public message: STRING_OR_NULL = null,
        public citations: number[] = [],
        public sources: STRING_OR_NULL = null,
        public loading: boolean = true,
        public error: STRING_OR_NULL = null
    ) {
        this.message = message;
        this.citations = citations;
        this.sources = sources;
        this.loading = loading;
        this.error = error;

        this.id = id || uuidv4();
        this.type = 'AI';
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

export const scrollAiAnswerIdIntoView = (ai_answer_id: AiAnswerIdType) => {
    if (ai_answer_id) {
        const documentEl = document.getElementById(ai_answer_id);
        if (documentEl) {
            documentEl.scrollIntoView({ behavior: "smooth", inline: "start", block: "start" })
        }
    }
}