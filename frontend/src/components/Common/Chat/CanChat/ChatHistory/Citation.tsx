"use client"

import { Button } from "@/components/ui/button"
import { UploadContextType, useUploadContext } from "@/lib/context/UploadContext"
import React from "react"

const Citation = ({ page }: { page: number }) => {
    const { scrollToPage } = useUploadContext() as UploadContextType

    const onClick = () => {
        scrollToPage(page)
    }

    return (
        <Button size="sm" onClick={onClick} variant="outline" className="bg-muted text-muted-foreground text-xs rounded-lg p-1 h-[18px]">
            {page}
        </Button>
    )
}

export default Citation
