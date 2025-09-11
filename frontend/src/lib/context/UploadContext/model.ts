import { Dispatch, FC, ReactNode, SetStateAction } from "react"



export type UploadContextType = {
    isUploadInProgress: boolean,
    uploadError: Partial<{
        message: string,
        error: string
    }> | null,
    uploadData: Partial<{
        pdf_id: string;
        relevant_questions: Array<string>
    }> | null,
    userUploadedPdf: File | null,
    uploadProgress: number | null,
    handleUploadPdf: (pdfFile: File) => Promise<boolean | { message: string }>,
    isUploadSheetOpen: boolean,
    setIsUploadSheetOpen: Dispatch<SetStateAction<boolean>>,
    scrollToPage: (pageNumber: number) => void,
    resetUpload: () => void
}

export type UploadContextProviderType = FC<{ children: ReactNode }>