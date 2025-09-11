import { AIMessage, UserMessage } from "@/lib/chat_history_utils";
import { AxiosError } from "axios";
import { Dispatch, FC, ReactNode, SetStateAction } from "react"

export type AiAnswerIdType = AIMessage["id"]

export type AiAnswerType = Pick<AIMessage, "citations" | "sources"> & {
    "answer": AIMessage["message"]
}

export type DataToUpdateWithType = AxiosError<{ error: string }> | AiAnswerType | Error

export type ChatContextType = {
    currentUserQuery: string;
    setCurrentUserQuery: Dispatch<SetStateAction<string>>
    addUserQuery: ({ message }: { message: UserMessage["message"] }) => void;
    chatHistory: Array<UserMessage | AIMessage>,
    responseLoading: boolean,
    sendUserQuery: (ai_answer_id: AiAnswerIdType) => void,
    updateAiAnswer: (dataToUpdateWith: DataToUpdateWithType, ai_answer_id: AiAnswerIdType) => void,
    resetChat: () => void,
    relevant_questions: Array<string>,
}

export type ChatContextProviderComponent = FC<{ children: ReactNode }>