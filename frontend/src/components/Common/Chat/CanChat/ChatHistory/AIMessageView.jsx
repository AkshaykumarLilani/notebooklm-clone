import React, { useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { useChatContext } from '@/lib/context/chat_context'
import { Sparkle } from 'lucide-react';
import Citation from './Citation';

const AIMessageView = ({ data: { error, loading, citations, sources, message, id } }) => {

    const { responseLoading, sendUserQuery } = useChatContext();

    return (
        <div className="flex justify-start mb-2 fade-in">
            <Card className="self-start mr-auto max-w-[70%] py-0">
                <CardContent className="p-4">
                    {(responseLoading || loading) ?
                        <div className='flex gap-3 items-center'>
                            <Sparkle className='animate-pulse w-3 h-3 text-foreground' />
                            Thinking ...
                        </div>
                        : <>
                            {
                                error ? <div className='flex gap-3 items-center'>
                                    <p className='text-destructive'>{error}</p>
                                </div> : <></>
                            }
                            {
                                message ? <div>
                                    <p className='text-foreground'>{message}</p>
                                </div> : <></>
                            }
                            {
                                Array.isArray(citations) && citations.length > 0 ? <>
                                    <div className='flex flex-wrap gap-2 mt-2'>
                                        {
                                            citations.map?.((page, index) => {
                                                return <Citation key={`citation_${index}`} page={page} />
                                            })
                                        }
                                    </div>
                                </> : <p className='mt-2 text-muted-foreground'><small>No Citations</small></p>
                            }
                        </>}
                </CardContent>
            </Card>
        </div>
    )
}

export default AIMessageView