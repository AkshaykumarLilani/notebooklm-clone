'use client';

import { useUploadContext } from '@/lib/context/upload_context';
import { FileText, Trash } from 'lucide-react';
import React, { useState } from 'react';
import PdfViewerModal from './PdfViewerModal';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useChatContext } from '@/lib/context/chat_context';
import axios from 'axios';

const UploadedView = ({ isCollapsed }) => {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const {
        isUploadInProgress,
        uploadError,
        uploadData,
        userUploadedPdf,
        resetUpload
    } = useUploadContext();

    const { resetChat } = useChatContext();


    const handleReset = () => {
        if (uploadData?.pdf_id) {
            axios.post('/delete', { pdf_id: uploadData.pdf_id });
        }
        resetUpload();
        resetChat();
        setIsConfirmModalOpen(false);
    };

    if (uploadData || userUploadedPdf) {
        return (
            <>
                <div className="w-full flex flex-col items-stretch">
                    <div className="flex gap-2 items-center justify-between bg-card px-3 py-3 rounded-lg border-1">
                        <div className='flex gap-2 items-center'>
                            <FileText className={`h-6 w-6 text-foreground ${isCollapsed ? 'mx-auto' : ''}`} />
                            {!isCollapsed &&
                                <div>
                                    <p className="text-sm font-medium truncate">{userUploadedPdf?.name}</p>
                                    <p className="text-xs text-muted-foreground mt-0">PDF File</p>
                                </div>
                            }
                        </div>
                {
                    !isCollapsed && (
                        <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
                            <DialogTrigger asChild>
                                <Button variant="primary" className="border-1 border-destructive" >
                                    <Trash className='text-destructive' />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Confirm Reset</DialogTitle>
                                    <DialogDescription>
                                        Are you sure you want to reset the uploaded PDF? This action cannot be undone.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsConfirmModalOpen(false)}>Cancel</Button>
                                    <Button variant="destructive" onClick={handleReset}>Reset</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )
                }
                    </div>
                    {!isCollapsed && userUploadedPdf && (
                        <PdfViewerModal userUploadedPdf={userUploadedPdf} isModal={false} />
                    )}
                </div>
            </>
        )
    }

    return null;
};

export default UploadedView;
