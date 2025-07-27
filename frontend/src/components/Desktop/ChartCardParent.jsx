"use client";

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "../ui/card"
import Chat from "../Common/Chat";

export function ChatCardParent({ className, titleClassNames }) {
    return (
        <Card className={cn(className, "gap-0")}>
            <CardHeader className={cn(titleClassNames)}>Chat</CardHeader>
            <CardContent className="px-3 py-3">
                <Chat />
            </CardContent>
        </Card>
    )
}
