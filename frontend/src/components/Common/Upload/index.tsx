"use client"

import { UploadContextType, useUploadContext } from "@/lib/context/UploadContext"
import React from "react"
import UploadedView from "./UploadedView"
import NotUploadedView from "./NotUploadedView"

const Upload = ({ isCollapsed }: { isCollapsed: boolean }) => {
    const { userUploadedPdf, uploadData, uploadError } = useUploadContext() as UploadContextType

    if (userUploadedPdf && uploadData && !uploadError) {
        return <UploadedView isCollapsed={isCollapsed} />
    } else {
        return <NotUploadedView isCollapsed={isCollapsed} />
    }
}

export default Upload
