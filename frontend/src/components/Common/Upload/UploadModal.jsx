"use client";

import React, { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Loader2, UploadCloud } from "lucide-react";
import { useUploadContext } from "@/lib/context/upload_context";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const UploadModal = () => {
    const [isDragging, setIsDragging] = useState(false);
    const { handleUploadPdf, uploadError, isUploadInProgress, uploadProgress, uploadData, isUploadSheetOpen, setIsUploadSheetOpen, userUploadedPdf } = useUploadContext();

    useEffect(() => {
        if (uploadData) {
            setIsUploadSheetOpen(false);
        }
    }, [uploadData, setIsUploadSheetOpen]);

    const handleFileSelect = async (file) => {
        if (file) {
            const success = await handleUploadPdf(file);
            if (success) {
                // Do nothing, let the useEffect handle closing the modal
            }
        }
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleFileChange = (e) => {
        e.preventDefault()
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileSelect(files[0]);
        }
    }

    return (
        <Sheet open={isUploadSheetOpen} onOpenChange={setIsUploadSheetOpen}>
            <SheetContent
                side="bottom"
                className="w-full flex flex-col items-center justify-center min-h-[70svh] bg-card"
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onInteractOutside={(e) => {
                    e.preventDefault();
                }}
            >
                <SheetHeader className="min-w-[90vw] md:min-w-[50vw] px-0">
                    <SheetTitle>Upload PDF</SheetTitle>
                    <SheetDescription>
                        Drag and drop your PDF file here or click to browse.
                    </SheetDescription>
                </SheetHeader>
                {uploadError && <p className="text-destructive mt-2 text-sm max-w-[50vw]">{uploadError?.error || uploadError.message}</p>}
                <div
                    className={`relative border-2 border-dashed rounded-lg p-10 text-center min-w-[90vw] md:min-w-[50vw] px-4 ${isDragging ? "border-primary" : "border-foreground"
                        }`}
                >
                    {!isUploadInProgress ? <>
                        <UploadCloud className={`mx-auto h-12 w-12 text-foreground ${uploadProgress === 100 ? "" : ""}`} />
                        <p className="mt-2 text-sm text-foreground">
                            {isDragging ? "Drop the file here" : "Drag and drop or"}
                        </p>
                        <input
                            type="file"
                            className="absolute top-0 left-0 h-full w-full opacity-0 cursor-pointer"
                            onChange={handleFileChange}
                            accept=".pdf"
                        />
                        <Button variant="outline" className="mt-4">
                            Browse File
                        </Button>
                    </> : <></>
                    }
                    {uploadError && <p className="text-destructive mt-2 text-sm">{uploadError.message}</p>}
                    {isUploadInProgress && (
                        <div className="w-full mt-4">
                            {uploadProgress === 100 ? (
                                <div className="flex items-center justify-center gap-2 my-2">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    <p className="text-muted-foreground text-sm">Processing PDF...</p>
                                </div>
                            ) : (
                                <>
                                    <Progress value={uploadProgress} />
                                    <p className="text-muted-foreground mt-2 text-sm">Uploading...</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default UploadModal;
