"use client";

import axios from "axios";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { toast } from "sonner";
import { AIMessage, scrollAiAnswerIdIntoView, UserMessage } from "../chat_history_utils";
import { useUploadContext } from "./upload_context";


const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {

    const { uploadData } = useUploadContext();

    const pdf_id = useMemo(() => uploadData?.pdf_id, [uploadData]);

    const [chatHistory, setChatHistory] = useState([]);
    const [currentUserQuery, setCurrentUserQuery] = useState("");

    const [responseLoading, setResponseLoading] = useState(false);

    const resetChat = () => {
        setChatHistory([]);
        setCurrentUserQuery("");
        setResponseLoading(false);
    }

    const updateAiAnswer = useCallback((dataToUpdateWith, ai_answer_id) => {
        try {
            let newAiAnswerObjectToReplaceWith = null;
            if (dataToUpdateWith instanceof Error) {
                if (dataToUpdateWith?.response?.data?.error) {
                    newAiAnswerObjectToReplaceWith = new AIMessage(
                        null,
                        null,
                        null,
                        null,
                        false,
                        dataToUpdateWith.response.data.error
                    )
                } else if (dataToUpdateWith?.message) {
                    newAiAnswerObjectToReplaceWith = new AIMessage(
                        null,
                        null,
                        null,
                        null,
                        false,
                        dataToUpdateWith.message
                    )
                } else {
                    newAiAnswerObjectToReplaceWith = new AIMessage(
                        null,
                        null,
                        null,
                        null,
                        false,
                        "Something went wrong"
                    )
                }
            } else {
                newAiAnswerObjectToReplaceWith = new AIMessage(
                    null,
                    dataToUpdateWith.answer,
                    dataToUpdateWith.citations,
                    dataToUpdateWith.sources,
                    false,
                    null
                )
            }

            setChatHistory((oldChatHistory) => {
                let history = [];
                for (const ch of oldChatHistory) {
                    if (ch instanceof AIMessage && ch.id === ai_answer_id) {
                        history.push(newAiAnswerObjectToReplaceWith);
                    } else {
                        history.push(ch);
                    }
                }
                return history;
            })
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    }, []);

    const sendUserQuery = useCallback(async (ai_answer_id) => {
        scrollAiAnswerIdIntoView(ai_answer_id);
        let question = currentUserQuery;
        try {
            setCurrentUserQuery("");
            setResponseLoading(true);
            const response = await axios.post("/chat", {
                pdf_id,
                question: question
            });
            updateAiAnswer(response.data, ai_answer_id);
            return response.data;
        } catch (error) {
            setCurrentUserQuery(question);
            updateAiAnswer(error, ai_answer_id)
        } finally {
            setResponseLoading(false);
        }
    }, [currentUserQuery, updateAiAnswer]);

    const addUserQuery = useCallback(({ message }) => {
        try {
            const userMessageObject = new UserMessage(message);
            const aiMessageObject = new AIMessage();
            setChatHistory((oldChatHistory) => {
                let history = [...oldChatHistory]
                history.push(userMessageObject);
                history.push(aiMessageObject);
                return history;
            });

            setTimeout(() => sendUserQuery(aiMessageObject.id), 100);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    }, [sendUserQuery]);


    return <ChatContext.Provider value={{
        currentUserQuery, setCurrentUserQuery,
        addUserQuery,
        chatHistory,
        responseLoading,
        sendUserQuery,
        updateAiAnswer,
        resetChat
    }}>
        {children}
    </ChatContext.Provider>
}

export const useChatContext = () => useContext(ChatContext);