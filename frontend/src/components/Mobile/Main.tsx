"use client"

import { cn } from "@/lib/utils"
import React, { useState, useRef, useEffect, ComponentPropsWithoutRef } from "react"
import Chat from "../Common/Chat"
import Upload from "../Common/Upload"
import { AppContextType, TABS, tabs, useAppContext } from "@/lib/context/AppContext"
import DeleteModal from "../Common/Upload/DeleteModal"
import { UploadContextType, useUploadContext } from "@/lib/context/UploadContext"

const Main = ({ className }: ComponentPropsWithoutRef<"div">) => {
    const { activeTabMobile, setActiveTabMobile, tabRefs, sliderStyle, setSliderStyle } = useAppContext() as AppContextType

    const { userUploadedPdf } = useUploadContext() as UploadContextType

    useEffect(() => {
        if (tabRefs[activeTabMobile].current) {
            const { offsetLeft, clientWidth } = tabRefs[activeTabMobile].current
            setSliderStyle({
                left: offsetLeft,
                width: `calc(100% - ${100 / tabs.length}%)`,
            })
        }
    }, [activeTabMobile])

    return (
        <div className={cn(className, "flex flex-col flex-1 gap-3")}>
            <div className="relative flex justify-center border-b">
                <div className="flex flex-1 justify-around mt-2">
                    {tabs.map((tab, index) => (
                        <div key={tab} ref={tabRefs[tab]} className={`px-4 py-2 text-lg font-medium hover:bg-muted flex-1 max-w-[50%] flex items-center justify-center\ ${activeTabMobile === tab ? "text-foreground" : "text-muted-foreground"}`} onClick={() => setActiveTabMobile(tab)}>
                            {tab === TABS.SOURCES && userUploadedPdf?.name ? (
                                <div className="w-full flex gap-2 items-center justify-between">
                                    <div className="max-w-[70%] truncate">{userUploadedPdf?.name}</div>
                                    <DeleteModal />
                                </div>
                            ) : (
                                <>{`${tab}`}</>
                            )}
                        </div>
                    ))}
                </div>
                <div className="absolute bottom-0 h-0.5 bg-foreground transition-all ease-in-out duration-200" style={sliderStyle} />
            </div>
            <div className="flex-1 overflow-hidden flex items-stretch">
                <div className="flex items-stretch w-full transition-transform ease-in-out duration-200" style={{ transform: `translateX(-${tabs.findIndex((val) => val === activeTabMobile) * 100}%)` }}>
                    <div className="w-full flex-shrink-0 flex items-center justify-center">
                        <Upload isCollapsed={false} />
                    </div>
                    <div className="w-full flex-shrink-0 ">
                        <Chat />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Main
