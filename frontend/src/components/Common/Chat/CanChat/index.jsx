"use client";

import { useUploadContext } from '@/lib/context/upload_context';
import React, { useMemo } from 'react'
import MessageBox from './MessageBox';
import ChatHistory from './ChatHistory';

const CanChat = () => {

    return (
        <div className='h-full relative flex flex-col items-stretch justify-between'>
            <ChatHistory />
            <MessageBox />
        </div>
    )
}

export default CanChat