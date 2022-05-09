import { CacheProvider } from "@emotion/react";
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { RemixBrowser } from "remix";
import { ClientStyleContext } from "./_chakra-setup/context";
import createEmotionCache from "./_chakra-setup/createEmotionCache";

interface ClientCacheProviderProps {
  children: React.ReactNode;
}

function ClientCacheProvider({ children }: ClientCacheProviderProps) {
  const [cache, setCache] = useState(createEmotionCache());

  function reset() {
    setCache(createEmotionCache());
  }

  return (
    <ClientStyleContext.Provider value={{ reset }}>
      <CacheProvider value={cache}>{children}</CacheProvider>
    </ClientStyleContext.Provider>
  );
}

ReactDOM.hydrateRoot(
  document,
  <ClientCacheProvider>
    <RemixBrowser />
  </ClientCacheProvider>
);
