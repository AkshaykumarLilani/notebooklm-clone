"use client";

import { AIMessage, MESSAGE_TYPES, UserMessage } from '@/lib/chat_history_utils';
import { useChatContext } from '@/lib/context/chat_context';
import React, { useEffect, useRef } from 'react'
import UserMessageView from './UserMessageView';
import AIMessageView from './AIMessageView';
import { cn } from '@/lib/utils';

const ChatHistory = ({ className }) => {

    const chatHistoryContainerRef = useRef(null);
    const { chatHistory } = useChatContext();

    useEffect(() => {
        chatHistoryContainerRef.current?.scrollTo?.(chatHistoryContainerRef.current.clientHeight, chatHistoryContainerRef.current.clientHeight);
    }, [chatHistory]);

    if (Array.isArray(chatHistory) && chatHistory.length > 0) {
        return <div ref={chatHistoryContainerRef} className={cn(className)}>
            {
                chatHistory.map((chat, index) => {
                    if (chat instanceof UserMessage) {
                        return <UserMessageView key={chat.id} data={chat} />
                    } else if (chat instanceof AIMessage) {
                        return <AIMessageView key={chat.id} data={chat} />
                    }
                })
            }
        </div>
    } else {
        return <div className={cn(className, "items-center justify-center")}>
            <p className='text-muted-foreground'>You can send your messages now</p>
        </div>
    }
}

export default ChatHistory