"use client"

import { UploadContextType, useUploadContext } from "@/lib/context/UploadContext"
import { FileText } from "lucide-react"
import React from "react"
import PdfViewerModal from "./PdfViewerModal"

const UploadedView = ({ isCollapsed }: { isCollapsed: boolean }) => {
    const { isUploadInProgress, uploadError, uploadData, userUploadedPdf, resetUpload } = useUploadContext() as UploadContextType

    if (uploadData || userUploadedPdf) {
        return (
            <>
                {isCollapsed ? (
                    <FileText className={`h-6 w-6 text-foreground mx-auto`} />
                ) : (
                    <>
                        <div className="flex-1 p-2 w-100 h-full flex flex-col items-stretch">
                            {/* <div className="flex gap-2 items-center justify-between bg-card px-3 py-3 rounded-lg border-1">
                                <div className='flex gap-2 items-center'>
                                    <FileText className={`h-6 w-6 text-foreground`} />
                                    <div>
                                        <p className="text-sm font-medium max-w-[70%] truncate">{userUploadedPdf?.name}</p>
                                        <p className="text-xs text-muted-foreground mt-0">PDF File</p>
                                    </div>
                                </div>
                            </div> */}
                            {userUploadedPdf && <PdfViewerModal userUploadedPdf={userUploadedPdf} isModal={false} />}
                        </div>
                    </>
                )}
            </>
        )
    }

    return null
}

export default UploadedView
