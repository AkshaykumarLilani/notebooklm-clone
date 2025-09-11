"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

type SonnerTheme = NonNullable<ToasterProps["theme"]>

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme } = useTheme()

    const themeProp = theme === "light" || theme === "dark" || theme === "system" ? { theme: theme as SonnerTheme } : {}

    return (
        <Sonner
            {...themeProp}
            className="toaster group"
            style={
                {
                    "--normal-bg": "var(--popover)",
                    "--normal-text": "var(--popover-foreground)",
                    "--normal-border": "var(--border)",
                } as React.CSSProperties
            }
            {...props}
        />
    )
}

export { Toaster }
