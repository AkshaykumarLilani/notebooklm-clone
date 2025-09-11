"use client"

import React, { useEffect } from "react"
import { ChatContextType, useChatContext } from "@/lib/context/ChatContext"

export default function Sidebar() {
    const { pdfList, activePdfId, fetchPdfList, selectPdf } = useChatContext() as ChatContextType

    useEffect(() => {
        fetchPdfList()
    }, [])

    return (
        <aside className="w-64 border-r h-screen overflow-y-auto p-4 bg-background hidden lg:block">
            <h2 className="text-xl font-semibold mb-4">Conversations</h2>
            {pdfList.length === 0 ? (
                <div className="text-foreground">No conversations found.</div>
            ) : (
                <ul className="space-y-2">
                    {pdfList.map((pdf) => (
                        <li key={pdf.pdf_id} className={`cursor-pointer px-3 py-2 rounded-lg transition ${activePdfId === pdf.pdf_id ? "bg-card text-primary font-bold" : "hover:bg-muted"}`} onClick={() => selectPdf(pdf.pdf_id)} title={pdf.filename}>
                            <div className="truncate">{pdf.filename}</div>
                        </li>
                    ))}
                </ul>
            )}
        </aside>
    )
}
