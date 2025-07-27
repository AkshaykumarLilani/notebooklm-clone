"use client";

import { cn } from '@/lib/utils';
import React from 'react'
import Header from './Header';
import Main from './Main';

const MobileView = ({ className }) => {
    return (
        <div className={cn(className, "flex-col flex-1")}>
            <Header className="min-h-[5vh] min-w-screen pt-3 px-3"/>
            <Main className="flex-1 w-100 min-w-screen py-3 px-3" />
        </div>
    )
}

export default MobileView;