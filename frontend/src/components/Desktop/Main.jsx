"use client";

import { cn } from '@/lib/utils'
import React, { useState } from 'react'
import { SourceCardParent } from './SourceCardParent'
import { ChatCardParent } from './ChartCardParent'
import UploadModal from '../Common/Upload/UploadModal';


const COMMON_CONTAINER_CLASSES = "rounded-xl bg-card border-1 py-0"
const COMMON_TITLE_CLASSES = "p-3 border-b-1 h-[5vh]"

const Main = ({ className }) => {
  const [isSourceCollapsed, setIsSourceCollapsed] = useState(false);

  const handleSourceCollapseToggle = () => {
    setIsSourceCollapsed(!isSourceCollapsed);
  }

  return (
    <div className={cn(className, "flex flex-1 gap-3 justify-center items-stretch")}>
      <SourceCardParent 
        titleClassNames={COMMON_TITLE_CLASSES} 
        className={cn(
          COMMON_CONTAINER_CLASSES, 
          { "flex-4": !isSourceCollapsed },
        )}
        isCollapsed={isSourceCollapsed}
        onToggleCollapse={handleSourceCollapseToggle}
      />
      <ChatCardParent 
        titleClassNames={COMMON_TITLE_CLASSES} 
        className={cn(
          COMMON_CONTAINER_CLASSES, 
          "flex-7"
        )} 
      />
      <UploadModal />
    </div>
  )
}

export default Main