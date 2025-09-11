"use client"

import { UploadContextType, useUploadContext } from "@/lib/context/UploadContext"
import React, { useEffect, useState } from "react"
import CanChat from "./CanChat"
import CannotChat from "./CannotChat"

const Chat = () => {
    const [canChat, setCanChat] = useState(false)

    const { userUploadedPdf, uploadData } = useUploadContext() as UploadContextType

    useEffect(() => {
        if (!userUploadedPdf || !uploadData) {
            setCanChat(false)
        } else {
            setCanChat(true)
        }
    }, [userUploadedPdf, uploadData])

    if (canChat) {
        return <CanChat />
    } else {
        return <CannotChat />
    }
}

export default Chat
