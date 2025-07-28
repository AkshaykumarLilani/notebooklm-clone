"use client";

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "../ui/card"
import Chat from "../Common/Chat";

export function ChatCardParent({ className, titleClassNames }) {
    return (
        <Card className={cn(className, "gap-0")}>
            <CardHeader className={cn(titleClassNames, "flex items-center")}>
                <span>Chat</span>
            </CardHeader>
            <CardContent className="p-0 h-100">
                <Chat />
            </CardContent>
        </Card>
    )
}
