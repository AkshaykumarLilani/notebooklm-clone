"use client";

import { useUploadContext } from '@/lib/context/upload_context';
import React from 'react';
import UploadedView from './UploadedView';
import NotUploadedView from './NotUploadedView';

const Upload = ({ isCollapsed }) => {

    const {
        userUploadedPdf, uploadedData, upload
    } = useUploadContext();

    if (userUploadedPdf && uploadedData && !uploadError) {
        return <UploadedView isCollapsed={isCollapsed} />
    } else {
        return <NotUploadedView isCollapsed={isCollapsed} />
    }
}

export default Upload