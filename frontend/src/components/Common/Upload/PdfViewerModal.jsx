
'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import dynamic from 'next/dynamic';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useUploadContext } from '@/lib/context/upload_context';

const Document = dynamic(() => import('react-pdf').then((mod) => mod.Document), { ssr: false });
const Page = dynamic(() => import('react-pdf').then((mod) => mod.Page), { ssr: false });

const PdfViewerModal = ({ userUploadedPdf, isModal = true }) => {
    const {pageRefs} = useUploadContext();

    const [numPages, setNumPages] = useState(null);
    const [scale, setScale] = useState(1.0);
    const [modalOpen, setModalOpen] = useState(false);

    useLayoutEffect(() => {
        import('react-pdf').then(({ pdfjs }) => {
            pdfjs.GlobalWorkerOptions.workerSrc = window.location.origin + "/pdf.worker.min.mjs";
        });
    }, []);

    if (!userUploadedPdf) {
        return null;
    }

    const pdfContent = (
        <div className="flex-grow overflow-auto">
            <Document
                file={userUploadedPdf}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                className="flex flex-col justify-center w-100"
            >
                {Array.apply(null, Array(numPages))
                    .map((x, i) => i + 1)
                    .map((page, index) => (
                        <Page
                            key={page}
                            pageNumber={page}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            className="mb-4"
                            scale={scale}
                            inputRef={(ref) => (ref && pageRefs.current.push(ref))}
                        />
                    ))}
            </Document>
        </div>
    );

    const zoomControls = (
        <>
            <Button
                variant="outline"
                size="icon"
                onClick={() => setScale((prev) => Math.max(0.5, prev - 0.1))}
            >
                <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm">{Math.round(scale * 100)}%</span>
            <Button
                variant="outline"
                size="icon"
                onClick={() => setScale((prev) => Math.min(2.0, prev + 0.1))}
            >
                <ZoomIn className="h-4 w-4" />
            </Button>
        </>
    );

    if (isModal) {
        return (
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Maximize className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-full h-full flex flex-col">
                    <div className="flex justify-center items-center space-x-2 mb-2">
                        {zoomControls}
                    </div>
                    {pdfContent}
                </DialogContent>
            </Dialog>
        );
    } else {
        return (
            <div className="mt-4 w-full h-[70svh] overflow-auto">
                <div className="flex justify-center items-center space-x-2 mb-2">
                    {zoomControls}
                    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Maximize className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="min-w-[90vw] h-[90vh] flex flex-col">
                            <div className="flex justify-center items-center space-x-2 mb-2">
                                {zoomControls}
                            </div>
                            {pdfContent}
                        </DialogContent>
                    </Dialog>
                </div>
                {!modalOpen && pdfContent}
            </div>
        );
    }
};

export default PdfViewerModal;
