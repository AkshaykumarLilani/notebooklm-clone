"use client";

import Image from 'next/image'
import React from 'react'

const Brand = () => {
    return (
        <div className='flex items-center gap-1'>
            <Image
                src={`https://akshaylilani.com/profile.webp`}
                alt='Akshaykumar Lilani'
                className='h-8 w-8 rounded-full border-1 p-1 border-foreground'
                width={30}
                height={30}
            />
            <span>NotebookLM Clone</span>
        </div>
    )
}

export default Brand;