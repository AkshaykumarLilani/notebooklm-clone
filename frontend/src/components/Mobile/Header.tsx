"use client"

import { cn } from "@/lib/utils"
import React from "react"
import { ModeToggle } from "../theme-toggle"
import Brand from "../brand"

const Header = ({ className }: { className: string }) => {
    return (
        <div className={cn(className, "flex justify-between")}>
            <Brand />
            <ModeToggle />
        </div>
    )
}

export default Header
