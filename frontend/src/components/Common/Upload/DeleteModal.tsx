import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ChatContextType, useChatContext } from "@/lib/context/ChatContext"
import { UploadContextType, useUploadContext } from "@/lib/context/UploadContext"
import axios from "axios"
import { Trash } from "lucide-react"
import React, { useState } from "react"

const DeleteModal = () => {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)

    const { uploadData, resetUpload } = useUploadContext() as UploadContextType

    const { resetChat } = useChatContext() as ChatContextType

    const handleReset = () => {
        if (uploadData?.pdf_id) {
            axios.post("/delete", { pdf_id: uploadData.pdf_id })
        }
        resetUpload()
        resetChat()
        setIsConfirmModalOpen(false)
    }

    return (
        <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="link" className="flex gap-2">
                    <Trash className="text-destructive" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Reset</DialogTitle>
                    <DialogDescription>Are you sure you want to reset the uploaded PDF? This action cannot be undone.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsConfirmModalOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleReset}>
                        Reset
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteModal
