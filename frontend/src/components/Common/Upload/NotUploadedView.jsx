"use client";

import React, { useState } from 'react';
import UploadModal from './UploadModal';
import { Button } from "@/components/ui/button";
import { UploadCloud } from 'lucide-react';

import { useUploadContext } from '@/lib/context/upload_context';
import UploadedView from './UploadedView';
import { cn } from '@/lib/utils';

const NotUploadedView = ({ isCollapsed }) => {
    const { setIsUploadSheetOpen, isUploadInProgress, uploadError, userUploadedPdf, uploadData } = useUploadContext();

    if (uploadData && userUploadedPdf) {
        return <UploadedView isCollapsed={isCollapsed} />;
    }

    return (
        <div className={cn("flex flex-col items-center justify-center h-full", "p-4")}>
            {!isCollapsed && (
                <>
                    <UploadCloud className={`h-12 w-12 text-foreground ${isCollapsed ? '' : 'mb-4'}`} />
                    <p className="text-lg text-foreground mb-4">
                        No files uploaded
                    </p><Button className={"text-foreground"} onClick={() => setIsUploadSheetOpen(true)} size={isCollapsed ? 'icon' : 'default'}>
                        Upload PDF
                    </Button>
                </>
            )}

        </div>
    );
};

export default NotUploadedView;
