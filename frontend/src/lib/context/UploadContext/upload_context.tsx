"use client"

import axios from "axios"
import { createContext, useCallback, useContext, useRef, useState } from "react"
import { toast } from "sonner"
import { AppContextType, TABS, useAppContext } from "../AppContext"
import { UploadContextProviderType, UploadContextType } from "./model"

const UploadContext = createContext<UploadContextType | undefined>(undefined)

export const UploadContextProvider: UploadContextProviderType = ({ children }) => {
    const { activeTabMobile, setActiveTabMobile } = useAppContext() as AppContextType

    const [isUploadSheetOpen, setIsUploadSheetOpen] = useState<UploadContextType["isUploadSheetOpen"]>(false)
    const [isUploadInProgress, setIsUploadInProgress] = useState<UploadContextType["isUploadInProgress"]>(false)
    const [uploadError, setUploadError] = useState<UploadContextType["uploadError"]>(null)
    const [uploadData, setUploadData] = useState<UploadContextType["uploadData"]>(null)
    const [userUploadedPdf, setUserUploadedPdf] = useState<UploadContextType["userUploadedPdf"]>(null)
    const [uploadProgress, setUploadProgress] = useState<UploadContextType["uploadProgress"]>(null)

    const scrollToPage: UploadContextType["scrollToPage"] = (pageNumber) => {
        const scrollNow = (isMobile = true) => {
            const query = `${isMobile ? "#mobile_view" : "#desktop_view"} div.react-pdf__Page[data-page-number='${pageNumber}']`
            const docEl = document.querySelector(query)
            console.log(docEl)
            docEl?.scrollIntoView({ behavior: "smooth", block: "start", inline: "start" })
        }

        if (activeTabMobile !== TABS.SOURCES) {
            setActiveTabMobile(TABS.SOURCES)
            setTimeout(scrollNow, 500)
        } else {
            scrollNow(false)
        }
    }

    const resetUpload = () => {
        setUploadData(null)
        setUserUploadedPdf(null)
        setUploadError(null)
        setUploadProgress(0)
    }

    const handleUploadPdf: UploadContextType["handleUploadPdf"] = useCallback(async (pdfFile) => {
        try {
            setIsUploadInProgress(true)
            setUploadError(null)
            setUploadProgress(0)
            setUploadData(null)

            if (pdfFile instanceof File) {
                const formData = new FormData()
                formData.append("file", pdfFile)
                const url = `${process.env.NEXT_PUBLIC_API_URL}/upload`

                // // testing
                // const response = {data: {}};
                // setUploadProgress(100);

                const response = await axios.post(url, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
                        setUploadProgress(percentCompleted)
                    },
                })

                setUploadData(response.data)
                setUserUploadedPdf(pdfFile)
                return Promise.resolve(true)
            } else {
                return Promise.reject({ message: "Something wrong with the file" })
            }
        } catch (error) {
            console.error(error)
            if (axios.isAxiosError<UploadContextType["uploadError"]>(error)) {
                const data = error.response?.data
                if (data) {
                    setUploadError(data)
                    toast.error(data.message ?? "Upload failed")
                } else {
                    toast.error(error.message)
                }
            } else if (error instanceof Error) {
                toast.error(error.message)
            } else {
                toast.error("Something went wrong")
            }
        } finally {
            setUploadProgress(0)
            setIsUploadInProgress(false)
        }
        return Promise.resolve(false)
    }, [])

    return (
        <UploadContext.Provider
            value={{
                isUploadInProgress,
                uploadError,
                uploadData,
                userUploadedPdf,
                uploadProgress,
                handleUploadPdf,
                isUploadSheetOpen,
                setIsUploadSheetOpen,
                scrollToPage,
                resetUpload,
            }}
        >
            {children}
        </UploadContext.Provider>
    )
}

export const useUploadContext = () => useContext(UploadContext)
