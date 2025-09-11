"use client"

import React, { ComponentPropsWithoutRef, FC } from "react"
import Header from "./Header"
import Main from "./Main"
// import Sidebar from './Sidebar';
import { cn } from "@/lib/utils"

const DesktopView = ({ className }: ComponentPropsWithoutRef<"div">) => (
    <div id="desktop_view" className={cn(className, "flex-1 flex-col justify-center items-center")}>
        <Header className="h-[8svh] w-screen pt-3 px-3" />
        <Main className="max-h-[92svh] overflow-hidden flex-1 w-screen py-3 px-3" />
        {/* <div className="flex-1 flex flex-col">
            <Header className="h-[8svh] w-full pt-3 px-3" />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <Main className="flex-1 overflow-auto" />
            </div>
        </div> */}
    </div>
)

export default DesktopView
