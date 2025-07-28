"use client";

import { cn } from '@/lib/utils';
import React from 'react'
import Header from './Header';
import Main from './Main';

const MobileView = ({ className }) => {
    return (
        <div className={cn(className, "flex-col flex-1")}>
            <Header className="h-[8svh] w-svw pt-3 px-3"/>
            <Main className="max-h-[92svh] overflow-hidden flex-1 w-svw py-3 px-0" />
        </div>
    )
}

export default MobileView;