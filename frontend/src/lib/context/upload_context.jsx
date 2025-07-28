"use client";

import axios from "axios";
import { createContext, useCallback, useContext, useRef, useState } from "react";
import { toast } from "sonner";
import { TABS, useAppContext } from "./app_context";

const UploadContext = createContext();

export const UploadContextProvider = ({ children }) => {

    const { activeTabMobile, setActiveTabMobile } = useAppContext();

    const [isUploadSheetOpen, setIsUploadSheetOpen] = useState(false);
    const [isUploadInProgress, setIsUploadInProgress] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [uploadData, setUploadData] = useState(null);
    const [userUploadedPdf, setUserUploadedPdf] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(null);

    const scrollToPage = (pageNumber) => {
        
        const scrollNow = (isMobile = true) => {
            const query = `${isMobile ? "#mobile_view" : "#desktop_view"} div.react-pdf__Page[data-page-number='${pageNumber}']`;
            const docEl = document.querySelector(query);
            console.log(docEl)
            docEl?.scrollIntoView({ behavior: "smooth", "block": "start", "inline": "start" });
        }


        if (activeTabMobile !== TABS.SOURCES) {
            setActiveTabMobile(TABS.SOURCES);
            setTimeout(scrollNow, 300);
        } else {
            scrollNow(false);
        }
    };

    const resetUpload = () => {
        setUploadData(null);
        setUserUploadedPdf(null);
        setUploadError(null);
        setUploadProgress(0);
    };

    const handleUploadPdf = useCallback(async (pdfFile) => {
        try {
            setIsUploadInProgress(true);
            setUploadError(null);
            setUploadProgress(0);
            setUploadData(null);

            if (pdfFile instanceof File) {
                const formData = new FormData();
                formData.append("file", pdfFile);
                const url = `${process.env.NEXT_PUBLIC_API_URL}/upload`;

                // // testing
                // const response = {data: {}};
                // setUploadProgress(100);

                const response = await axios.post(url, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setUploadProgress(percentCompleted);
                    },
                });

                setUploadData(response.data);
                setUserUploadedPdf(pdfFile);
                return true;
            } else {
                return Promise.reject({ "message": "Something wrong with the file" });
            }

        } catch (error) {
            console.error(error);
            if (error?.response?.data) {
                setUploadError(error?.response?.data);
            } else if (error?.message) {
                toast.error(error.message, "error");
                setUploadData(error);
            } else {
                toast.error("Something went wrong", "error");
            }
        } finally {
            setUploadProgress(0);
            setIsUploadInProgress(false);
        }
    }, []);

    return <UploadContext.Provider value={{
        isUploadInProgress,
        uploadError,
        uploadData,
        userUploadedPdf,
        uploadProgress,
        handleUploadPdf,
        isUploadSheetOpen,
        setIsUploadSheetOpen,
        scrollToPage,
        resetUpload
    }}>
        {children}
    </UploadContext.Provider>
}

export const useUploadContext = () => useContext(UploadContext);