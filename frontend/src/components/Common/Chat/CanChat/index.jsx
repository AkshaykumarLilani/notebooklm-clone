"use client";

import { useUploadContext } from '@/lib/context/upload_context';
import React, { useMemo } from 'react'
import MessageBox from './MessageBox';
import ChatHistory from './ChatHistory';

const CanChat = () => {

    return (
        <div className='h-full w-full relative flex flex-col overflow-hidden p-1 md:p-3'>
            <ChatHistory className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden mb-3 p-2" />
            <MessageBox className="w-full" />
        </div>
    )
}

export default CanChat