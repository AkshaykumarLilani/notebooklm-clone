"use client";

import React from 'react'
import Header from './Header'
import Main from './Main'
import { cn } from '@/lib/utils'

const DesktopView = ({ className }) => {
    return (
        <div className={cn(className, "flex-1 flex-col justify-center items-center")}>
            <Header className="min-h-[5vh] min-w-screen pt-3 px-3" />
            <Main className="flex-1 w-100 min-w-screen py-3 px-3" />
        </div>
    )
}

export default DesktopView;