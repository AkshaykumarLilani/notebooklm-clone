"use client";

import { Button } from '@/components/ui/button';
import { useChatContext } from '@/lib/context/chat_context';
import { cn } from '@/lib/utils';
import { SendHorizontal } from 'lucide-react';
import React, { useState } from 'react'
import { toast } from 'sonner';

const MessageBox = ({ className }) => {

    const { currentUserQuery, setCurrentUserQuery, addUserQuery, responseLoading, relevant_questions } = useChatContext();

    const onQuerySubmit = async (e) => {
        e.preventDefault();

        if (currentUserQuery?.length === 0) {
            toast.error("Empty messages not allowed");
            return;
        }

        addUserQuery({ message: currentUserQuery });
    }

    return (
        <div className={cn(className, "min-w-0 w-full flex flex-col")}>
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
                    className="rounded-full flex items-center justify-center bg-muted-foreground w-10 h-10"
                    type="submit"
                    variant="primary"
                    onClick={onQuerySubmit}
                    disabled={responseLoading}
                >
                    <SendHorizontal className='w-10 h-10 text-background' />
                </Button>
            </form>
            {
                Array.isArray(relevant_questions) && relevant_questions.length > 0 ? <>
                    <div id="relevant_questions" className='flex flex-1 max-w-full items-stretch justify-start gap-2 py-2 overflow-y-hidden overflow-x-auto scrollbar-hidden'>
                        {
                            relevant_questions?.map((qn, index) => <div 
                                key={index} 
                                className='flex-none p-2 border-1 bg-secondary rounded-xl cursor-pointer'
                                onClick={() => setCurrentUserQuery(qn)}
                                >
                                {qn}
                            </div>)
                        }
                    </div>
                </> : <></>
            }
        </div>
    )
}

export default MessageBox