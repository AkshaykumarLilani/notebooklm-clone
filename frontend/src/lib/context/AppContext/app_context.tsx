"use client"

import { createContext, FC, useContext, useRef, useState } from "react"
import {
    AppContextProviderType,
    AppContextType,
    SliderStyleType,
    TAB_REFS_TYPE,
    TABS,
    TABS_TYPE,
} from "./model"

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppContextProvider: AppContextProviderType = ({ children }) => {
    const tabRefs: TAB_REFS_TYPE = { [TABS.SOURCES]: useRef(null), [TABS.CHAT]: useRef(null) }

    const [activeTabMobile, setActiveTabMobile] = useState<TABS_TYPE>(TABS.SOURCES)
    const [sliderStyle, setSliderStyle] = useState<SliderStyleType>({})

    return (
        <AppContext.Provider
            value={{
                activeTabMobile,
                setActiveTabMobile,
                tabRefs,
                sliderStyle,
                setSliderStyle,
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)
