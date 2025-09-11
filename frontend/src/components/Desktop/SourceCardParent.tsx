"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "../ui/card"
import { PanelLeftClose, PanelRightClose } from "lucide-react"
import Upload from "../Common/Upload"
import { UploadContextType, useUploadContext } from "@/lib/context/UploadContext"
import DeleteModal from "../Common/Upload/DeleteModal"

type SourceCardParentProps = {
    className: string
    titleClassNames: string
    isCollapsed: boolean
    onToggleCollapse: () => void
}

export function SourceCardParent({ className, titleClassNames, isCollapsed, onToggleCollapse }: SourceCardParentProps) {
    const { uploadData, userUploadedPdf } = useUploadContext() as UploadContextType

    return (
        <Card className={cn(className, isCollapsed ? "px-3 flex-grow-0 flex-shrink-0 transition-all duration-300 ease-in-out" : "transition-all duration-300 ease-in-out gap-0")}>
            <CardHeader className={cn(titleClassNames, "flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
                {!isCollapsed && <div className="text-sm font-medium max-w-[70%] truncate">{userUploadedPdf?.name ? userUploadedPdf?.name : "Source"}</div>}
                <div className="flex items-center gap-2">
                    {(uploadData || userUploadedPdf) && !isCollapsed ? <DeleteModal /> : <></>}
                    <div onClick={onToggleCollapse} className="cursor-pointer">
                        {isCollapsed ? <PanelRightClose className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-0 py-0 flex">
                <Upload isCollapsed={isCollapsed} />
            </CardContent>
        </Card>
    )
}
