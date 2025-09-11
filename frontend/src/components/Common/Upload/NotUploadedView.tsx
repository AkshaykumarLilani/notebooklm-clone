"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { UploadCloud } from "lucide-react"

import { UploadContextType, useUploadContext } from "@/lib/context/UploadContext"
import UploadedView from "./UploadedView"
import { cn } from "@/lib/utils"

const NotUploadedView = ({ isCollapsed }: { isCollapsed: boolean }) => {
    const { setIsUploadSheetOpen, isUploadInProgress, uploadError, userUploadedPdf, uploadData } = useUploadContext() as UploadContextType

    if (uploadData && userUploadedPdf) {
        return <UploadedView isCollapsed={isCollapsed} />
    }

    return (
        <div className={cn("flex flex-1 flex-col items-center justify-center h-full", "p-4")}>
            {!isCollapsed && (
                <>
                    <UploadCloud className={`h-12 w-12 text-foreground ${isCollapsed ? "" : "mb-4"}`} />
                    <p className="text-lg text-foreground mb-4">No files uploaded</p>
                    <Button className={"text-foreground"} onClick={() => setIsUploadSheetOpen(true)} size={isCollapsed ? "icon" : "default"}>
                        Upload PDF
                    </Button>
                </>
            )}
        </div>
    )
}

export default NotUploadedView
