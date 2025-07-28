"use client";

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "../ui/card"
import { PanelLeftClose, PanelRightClose } from "lucide-react"
import Upload from "../Common/Upload";

export function SourceCardParent({
    className,
    titleClassNames,
    isCollapsed,
    onToggleCollapse
}) {
    return (
        <Card className={cn(
            className,
            isCollapsed
                ? "px-3 flex-grow-0 flex-shrink-0 transition-all duration-300 ease-in-out"
                : "transition-all duration-300 ease-in-out gap-0"
        )}>
            <CardHeader className={cn(
                titleClassNames,
                "flex items-center",
                isCollapsed ? "justify-center" : "justify-between"
            )}>
                {!isCollapsed && <span>Sources</span>}
                <div onClick={onToggleCollapse} className="cursor-pointer">
                    {isCollapsed ? <PanelRightClose className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
                </div>
            </CardHeader>
            <CardContent className="px-0 py-0 flex">
                <Upload  isCollapsed={isCollapsed} />
            </CardContent>
        </Card>
    )
}
