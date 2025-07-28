"use client";

import { cn } from '@/lib/utils'
import React, { useState, useRef, useEffect } from 'react'
import Chat from '../Common/Chat';
import Upload from '../Common/Upload';

const tabs = ['Sources', 'Chat'];

const Main = ({ className }) => {
    const [activeTab, setActiveTab] = useState(0);
    const tabRefs = [useRef(null), useRef(null)];
    const [sliderStyle, setSliderStyle] = useState({});

    useEffect(() => {
        if (tabRefs[activeTab].current) {
            const { offsetLeft, clientWidth } = tabRefs[activeTab].current;
            setSliderStyle({
                left: offsetLeft,
                width: `calc(100% - ${100/tabs.length}%)`,
            });
        }
    }, [activeTab]);


    return (
        <div className={cn(className, "flex flex-col flex-1 gap-3")}>
            <div className="relative flex justify-center border-b">
                <div className="flex flex-1 justify-around">
                    {tabs.map((tab, index) => (
                        <button
                            key={index}
                            ref={tabRefs[index]}
                            className={`px-4 py-2 text-lg font-medium hover:bg-muted flex-1 ${activeTab === index ? 'text-foreground' : 'text-muted-foreground'}`}
                            onClick={() => setActiveTab(index)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div
                    className="absolute bottom-0 h-0.5 bg-foreground transition-all ease-in-out duration-500"
                    style={sliderStyle}
                />
            </div>
            <div className="flex-1 overflow-hidden flex items-stretch">
                <div
                    className="flex items-stretch w-full transition-transform ease-in-out duration-500"
                    style={{ transform: `translateX(-${activeTab * 100}%)` }}
                >
                    <div className="w-full flex-shrink-0 ">
                        <Upload isCollapsed={false} />
                    </div>
                    <div className="w-full flex-shrink-0 ">
                        <Chat />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Main;