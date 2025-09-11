"use client"

import React, { useLayoutEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, Maximize } from "lucide-react"
import dynamic from "next/dynamic"

import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"
import { cn } from "@/lib/utils"
import { UploadContextType } from "@/lib/context/UploadContext"

const Document = dynamic(() => import("react-pdf").then((mod) => mod.Document), { ssr: false })
const Page = dynamic(() => import("react-pdf").then((mod) => mod.Page), { ssr: false })

const PdfViewerModal = ({ userUploadedPdf, isModal = true }: { userUploadedPdf: UploadContextType["userUploadedPdf"]; isModal: boolean }) => {
    const [numPages, setNumPages] = useState<number | null>(null)
    const [scale, setScale] = useState<number>(1.0)
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const containerRef = useRef<null | HTMLDivElement>(null)

    useLayoutEffect(() => {
        import("react-pdf").then(({ pdfjs }) => {
            pdfjs.GlobalWorkerOptions.workerSrc = window.location.origin + "/pdf.worker.min.mjs"
        })
    }, [])

    if (!userUploadedPdf) {
        return null
    }

    const pdfContent = (
        <div ref={containerRef} className="flex-grow overflow-auto flex flex-col justify-start items-center bg-secondary">
            <Document
                file={userUploadedPdf}
                onLoadSuccess={(pdf) => {
                    console.log({ pdf })
                    if (containerRef.current && pdf) {
                        pdf.getPage(1).then((page) => {
                            const viewport = page.getViewport({ scale: 1 })
                            const pdfWidth = viewport.width
                            const containerWidth = containerRef.current!.offsetWidth - 20
                            const calculatedScale = containerWidth / pdfWidth
                            console.log({ viewport, pdfWidth, containerWidth, calculatedScale })
                            setScale(calculatedScale)
                            setNumPages(pdf.numPages)
                        })
                    }
                }}
                className={cn("flex flex-col justify-center gap-2", { "w-100": isModal })}
                scale={scale}
            >
                {Array.apply(null, Array(numPages))
                    .map((x, i) => i + 1)
                    .map((page, index) => (
                        <Page key={page} pageNumber={page} renderTextLayer={false} renderAnnotationLayer={false} className="" />
                    ))}
            </Document>
        </div>
    )

    const zoomControls = (
        <>
            <Button variant="outline" size="icon" onClick={() => setScale((prev) => Math.max(0.5, prev - 0.1))}>
                <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm">{Math.round(scale * 100)}%</span>
            <Button variant="outline" size="icon" onClick={() => setScale((prev) => Math.min(2.0, prev + 0.1))}>
                <ZoomIn className="h-4 w-4" />
            </Button>
        </>
    )

    if (isModal) {
        return (
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Maximize className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-full h-full flex flex-col">
                    <div className="flex justify-center items-center space-x-2 mb-2 p-2">{zoomControls}</div>
                    {pdfContent}
                </DialogContent>
            </Dialog>
        )
    } else {
        return (
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <div className="mt-0 lg:mt-1 flex flex-1 flex-col gap-2 justify-center items-center mb-2">
                    <div className="flex justify-center items-center space-x-2 mb-2">
                        {zoomControls}
                        <DialogTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Maximize className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                    </div>
                    <div className="w-full h-[70svh] overflow-auto p-2 lg:p-0">
                        <DialogTitle className="hidden">Pdf Viewer</DialogTitle>
                        <DialogContent className="min-w-[90vw] h-[90vh] flex flex-col">
                            <div className="flex justify-center items-center space-x-2 mb-2">{zoomControls}</div>
                            {pdfContent}
                        </DialogContent>
                        {!modalOpen && pdfContent}
                    </div>
                </div>
            </Dialog>
        )
    }
}

export default PdfViewerModal
