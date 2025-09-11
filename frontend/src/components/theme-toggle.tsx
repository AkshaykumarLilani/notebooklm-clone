"use client";

import * as React from "react"
import { Hourglass, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group"

export function ModeToggle() {
    const { theme, setTheme } = useTheme();
    
    React.useEffect(()=>{
        setTheme("system");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ToggleGroup variant="outline" type="single" value={theme}>
            <ToggleGroupItem value="light" aria-label="Toggle light" onClick={() => setTheme("light")}>
                <Sun className="h-[1.2rem] w-[1.2rem]" />
            </ToggleGroupItem>
            <ToggleGroupItem value="dark" aria-label="Toggle dark" onClick={() => setTheme("dark")}>
                <Moon className="h-[1.2rem] w-[1.2rem]" />
            </ToggleGroupItem>
            <ToggleGroupItem value="system" aria-label="Toggle system" onClick={() => setTheme("system")}>
                <Hourglass className="h-[1.2rem] w-[1.2rem]" />
            </ToggleGroupItem>
        </ToggleGroup>
    )
}