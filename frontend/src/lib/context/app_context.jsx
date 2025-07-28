"use client";

import { createContext, useContext, useRef, useState } from "react";

export const TABS = {
    'SOURCES': 'Sources',
    'CHAT': 'Chat'
}

export const tabs = [TABS.SOURCES, TABS.CHAT];

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

    const tabRefs = { [TABS.SOURCES]: useRef(null), [TABS.CHAT]: useRef(null) };
    const [activeTabMobile, setActiveTabMobile] = useState(TABS.SOURCES);
    const [sliderStyle, setSliderStyle] = useState({});


    return <AppContext.Provider value={{
        activeTabMobile, setActiveTabMobile,
        tabRefs,
        sliderStyle, setSliderStyle
    }}>
        {children}
    </AppContext.Provider>
}

export const useAppContext = () => useContext(AppContext);