import React from 'react'
import { Card, CardContent } from '@/components/ui/card'

const UserMessageView = ({ data }) => {

    return (
        <div className="flex justify-end mb-2">
            <Card className="self-end ml-auto max-w-[70%] bg-accent text-foreground py-0">
                <CardContent className="p-4">
                    {data?.message}
                </CardContent>
            </Card>
        </div>
    )
}

export default UserMessageView