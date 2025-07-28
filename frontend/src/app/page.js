"use client"

import DesktopView from "@/components/Desktop";
import MobileView from "@/components/Mobile";
import { AppContextProvider } from "@/lib/context/app_context";
import { ChatContextProvider } from "@/lib/context/chat_context";
import { UploadContextProvider } from "@/lib/context/upload_context";
import axios from "axios";
import { Loader } from "lucide-react";
import { useLayoutEffect, useState } from "react";

export default function Home() {

  const [isBaseUrlSet, setIsBaseUrlSet] = useState(null);

  useLayoutEffect(() => {
    const base_url = process.env.NEXT_PUBLIC_API_URL;

    if (base_url) {
      setIsBaseUrlSet(true);
      axios.defaults.baseURL = base_url;
    } else {
      setIsBaseUrlSet(false);
    }

  }, [isBaseUrlSet]);

  if (isBaseUrlSet === false) {
    return (
      <div className="flex min-h-screen min-w-screen items-center justify-center">
        <h1>
          The <pre>NEXT_PUBLIC_API_URL</pre> env variable is not set, please create a .env file and set it.
        </h1>
      </div>
    )
  } else if (isBaseUrlSet === true) {
    return (
      <AppContextProvider>
        <UploadContextProvider>
          <ChatContextProvider>
            <div className="font-sans flex flex-col items-center justify-center gap-2 website-root-element-container">
              <DesktopView className="md:flex hidden" />
              <MobileView className="flex md:hidden" />
            </div>
          </ChatContextProvider>
        </UploadContextProvider>
      </AppContextProvider>
    );
  } else {
    return (
      <div className="flex flex-col min-h-screen min-w-screen items-center justify-center">
        <Loader className="w-8 h-8 text-foreground animate-spin" />
        <span>Setting up a few things ...</span>
      </div>
    )
  }
}
