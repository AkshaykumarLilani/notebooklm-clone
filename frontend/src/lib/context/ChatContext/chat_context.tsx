"use client"

import axios, { AxiosError } from "axios"
import { createContext, useCallback, useContext, useMemo, useState } from "react"
import { toast } from "sonner"
import { AIMessage, scrollAiAnswerIdIntoView, UserMessage } from "../../chat_history_utils"
import { UploadContextType, useUploadContext } from "../UploadContext"
import { ChatContextProviderComponent, ChatContextType } from "./model"

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const ChatContextProvider: ChatContextProviderComponent = ({ children }) => {
    const { uploadData } = useUploadContext() as UploadContextType

    const pdf_id = useMemo(() => uploadData?.pdf_id, [uploadData])
    const relevant_questions = useMemo(() => uploadData?.relevant_questions || [], [uploadData])

    const [chatHistory, setChatHistory] = useState<ChatContextType["chatHistory"]>([])
    const [currentUserQuery, setCurrentUserQuery] = useState<ChatContextType["currentUserQuery"]>("")

    const [responseLoading, setResponseLoading] = useState(false)

    const resetChat: ChatContextType["resetChat"] = () => {
        setChatHistory([])
        setCurrentUserQuery("")
        setResponseLoading(false)
    }

    const updateAiAnswer: ChatContextType["updateAiAnswer"] = useCallback((dataToUpdateWith, ai_answer_id) => {
        try {
            let newAiAnswerObjectToReplaceWith = null
            if (dataToUpdateWith instanceof AxiosError) {
                if (dataToUpdateWith?.response?.data?.error) {
                    newAiAnswerObjectToReplaceWith = new AIMessage(null, null, [], null, false, dataToUpdateWith.response.data.error)
                } else if (dataToUpdateWith?.message) {
                    newAiAnswerObjectToReplaceWith = new AIMessage(null, null, [], null, false, dataToUpdateWith.message)
                } else {
                    newAiAnswerObjectToReplaceWith = new AIMessage(null, null, [], null, false, "Something went wrong")
                }
            } else if (dataToUpdateWith instanceof Error) {
                newAiAnswerObjectToReplaceWith = new AIMessage(null, null, [], null, false, `${dataToUpdateWith}`)
            } else {
                newAiAnswerObjectToReplaceWith = new AIMessage(null, dataToUpdateWith.answer, dataToUpdateWith.citations, dataToUpdateWith.sources, false, null)
            }

            setChatHistory((oldChatHistory) => {
                let history = []
                for (const ch of oldChatHistory) {
                    if (ch instanceof AIMessage && ch.id === ai_answer_id) {
                        history.push(newAiAnswerObjectToReplaceWith)
                    } else {
                        history.push(ch)
                    }
                }
                return history
            })
        } catch (error) {
            console.error(error)
            toast.error("Something went wrong")
        }
    }, [])

    const sendUserQuery: ChatContextType["sendUserQuery"] = useCallback(
        async (ai_answer_id) => {
            scrollAiAnswerIdIntoView(ai_answer_id)
            let question = currentUserQuery
            try {
                setCurrentUserQuery("")
                setResponseLoading(true)
                const previousConversation = []
                try {
                    for (const convo of chatHistory) {
                        if (convo instanceof UserMessage) {
                            previousConversation.push({
                                role: "user",
                                content: convo.message,
                            })
                        } else if (convo instanceof AIMessage) {
                            previousConversation.push({
                                role: "system",
                                content: convo.message,
                            })
                        }
                    }
                } catch (err) {
                    console.error(err)
                }
                const response = await axios.post("/chat", {
                    pdf_id,
                    question: question,
                    previous_conversation: previousConversation,
                })
                updateAiAnswer(response.data, ai_answer_id)
                return response.data
            } catch (error) {
                setCurrentUserQuery(question)
                updateAiAnswer(new Error(`${error}`), ai_answer_id)
            } finally {
                setResponseLoading(false)
            }
        },
        [currentUserQuery, updateAiAnswer, chatHistory, pdf_id],
    )

    const addUserQuery: ChatContextType["addUserQuery"] = useCallback(
        ({ message }) => {
            try {
                const userMessageObject = new UserMessage(message)
                const aiMessageObject = new AIMessage()
                setChatHistory((oldChatHistory) => {
                    let history = [...oldChatHistory]
                    history.push(userMessageObject)
                    history.push(aiMessageObject)
                    return history
                })

                setTimeout(() => sendUserQuery(aiMessageObject.id), 100)
            } catch (error) {
                console.error(error)
                toast.error("Something went wrong")
            }
        },
        [sendUserQuery],
    )

    return (
        <ChatContext.Provider
            value={{
                currentUserQuery,
                setCurrentUserQuery,
                addUserQuery,
                chatHistory,
                responseLoading,
                sendUserQuery,
                updateAiAnswer,
                resetChat,
                relevant_questions,
            }}
        >
            {children}
        </ChatContext.Provider>
    )
}

export const useChatContext = () => useContext(ChatContext)
