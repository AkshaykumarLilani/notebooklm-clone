"use client";

import { Button } from '@/components/ui/button';
import { useUploadContext } from '@/lib/context/upload_context';
import React from 'react'

const Citation = ({ page }) => {
    const { scrollToPage } = useUploadContext();

    const onClick = () => {
        scrollToPage(page);
    }

    return (
        <Button size="sm" onClick={onClick} variant="outline" className='bg-muted text-muted-foreground text-xs rounded-lg p-1 h-[18px]'>{page}</Button>
    )
}

export default Citation