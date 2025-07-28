"use client";

import React from 'react'
import Upload from '@/components/Common/Upload'

const CannotChat = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <p className="text-lg text-muted-foreground mb-4">Please upload a PDF from sources to chat.</p>
        </div>
    )
}

export default CannotChat