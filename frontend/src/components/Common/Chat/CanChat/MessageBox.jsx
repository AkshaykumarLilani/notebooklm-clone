"use client";

import { Button } from '@/components/ui/button';
import { useChatContext } from '@/lib/context/chat_context';
import { SendHorizontal } from 'lucide-react';
import React, { useState } from 'react'
import { toast } from 'sonner';

const MessageBox = () => {

    const { currentUserQuery, setCurrentUserQuery, addUserQuery, responseLoading } = useChatContext();

    const onQuerySubmit = async (e) => {
        e.preventDefault();

        if (currentUserQuery?.length === 0) {
            toast.error("Empty messages not allowed");
            return;
        }

        addUserQuery({message: currentUserQuery});
    }

    return (
        <div className='w-full'>
            <form className='p-2 rounded-lg border-1 border-muted-foreground flex'>
                <textarea
                    className='flex-1 focus:outline-none scrollbar-hidden p-1'
                    name='user_query'
                    placeholder='Type your query here'
                    value={currentUserQuery}
                    onChange={({ target: { value } }) => setCurrentUserQuery(value)}
                    disabled={responseLoading}
                />
                <Button
                    className="rounded-full flex items-center justify-center bg-muted-foreground"
                    type="submit"
                    variant="primary"
                    onClick={onQuerySubmit}
                    disabled={responseLoading}
                >
                    <SendHorizontal className='w-10 h-10' />
                </Button>
            </form>
        </div>
    )
}

export default MessageBox