"use client"

import DesktopView from "@/components/Desktop";
import MobileView from "@/components/Mobile";
import { AppContextProvider } from "@/lib/context/app_context";
import { ChatContextProvider } from "@/lib/context/chat_context";
import { UploadContextProvider } from "@/lib/context/upload_context";
import axios from "axios";
import { Loader } from "lucide-react";
import { useEffect, useLayoutEffect, useState } from "react";

export default function Home() {

  const [isBaseUrlSet, setIsBaseUrlSet] = useState(null);
  const [isBackendUp, setIsBackendUp] = useState(null);

  useLayoutEffect(() => {
    const base_url = process.env.NEXT_PUBLIC_API_URL;

    if (base_url) {
      setIsBaseUrlSet(true);
      axios.defaults.baseURL = base_url;
    } else {
      setIsBaseUrlSet(false);
    }

  }, [isBaseUrlSet]);

  useEffect(() => {

    const checkIfBackendIsReachable = async () => {
      for (let i = 0; i < 3; i++) {
        try {
          await axios.get("/");
          setIsBackendUp(true);
          return;
        } catch (err) {
          if (i < 2) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
      setIsBackendUp(false);
    }

    if (isBaseUrlSet) {
      checkIfBackendIsReachable();
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
  }

  if (isBackendUp === false) {
    return (
      <div className="flex flex-col min-h-screen min-w-screen items-center justify-center text-center p-4">
        <h1 className="text-4xl mb-2">☹️</h1>
        <h2 className="text-xl font-semibold mb-2">{`Could not connect to Backend`}</h2>
        <p className="text-muted-foreground">
          {`The application could not connect to the backend after several attempts.`}
        </p>
        <p className="text-muted-foreground">
          {`You can try again by reloading the page or check back in later`}
        </p>
      </div>
    )
  }

  if (isBackendUp === true) {
    return (
      <AppContextProvider>
        <UploadContextProvider>
          <ChatContextProvider>
            <div className="font-sans flex flex-col items-center justify-center gap-2 website-root-element-container">
              <DesktopView className="lg:flex hidden" />
              <MobileView className="flex lg:hidden" />
            </div>
          </ChatContextProvider>
        </UploadContextProvider>
      </AppContextProvider>
    );
  }

  return (
    <div className="flex flex-col min-h-screen min-w-screen items-center justify-center text-center p-4">
      <Loader className="w-10 h-10 text-foreground animate-spin mb-4" />
      <h2 className="text-xl font-semibold mb-2">{`Connecting to the backend...`}</h2>
      <p className="text-muted-foreground">
        {`The backend is hosted on a free service and may take up to 50 seconds to start up if it's been inactive.`}
      </p>
      <p className="text-muted-foreground mt-2">
        {`Please be patient.`}
      </p>
    </div>
  )
}
