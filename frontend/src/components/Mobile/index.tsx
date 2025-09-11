"use client"

import { cn } from "@/lib/utils"
import React from "react"
import Header from "./Header"
import Main from "./Main"

const MobileView = ({ className }: { className: string }) => {
    return (
        <div id="mobile_view" className={cn(className, "flex-col flex-1")}>
            <Header className="h-[6svh] w-svw pt-3 px-3" />
            <Main className="max-h-[94svh] overflow-hidden flex-1 w-svw pb-3 px-0" />
        </div>
    )
}

export default MobileView
