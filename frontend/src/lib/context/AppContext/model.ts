"use client";

import { type Dispatch, type FC, type ReactNode, type RefObject, type SetStateAction } from "react"

export type TABS_TYPE = "Sources" | "Chat"

export const TABS = {
    SOURCES: "Sources",
    CHAT: "Chat",
} as const

export const tabs: TABS_TYPE[] = [TABS.SOURCES, TABS.CHAT]

export type TAB_REFS_TYPE = Record<TABS_TYPE, RefObject<null>>

export type SliderStyleType = Partial<Pick<React.CSSProperties, "left" | "width">>

export type AppContextType = {
    activeTabMobile: TABS_TYPE
    setActiveTabMobile: Dispatch<SetStateAction<TABS_TYPE>>
    tabRefs: TAB_REFS_TYPE
    sliderStyle: SliderStyleType
    setSliderStyle: Dispatch<SetStateAction<SliderStyleType>>
}

export type AppContextProviderType = FC<{ children: ReactNode }>