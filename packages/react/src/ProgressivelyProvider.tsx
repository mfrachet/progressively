import React, { useRef, useEffect } from "react";
import { ProgressivelyContext } from "./ProgressivelyContext";
import ProgressivelySdk from "@progressively/sdk-js";
import { ProgressivelyProviderProps } from "./types";
import { useFlagInit } from "./useFlagInit";

export const ProgressivelyProvider = ({
  children,
  clientKey,
  initialFlags,
  onlyRenderWhenReady = true,
  apiUrl,
  websocketUrl,
  fields = {},
}: ProgressivelyProviderProps) => {
  const sdkRef = useRef(
    ProgressivelySdk.init(clientKey, { fields, apiUrl, websocketUrl })
  );

  const { flags, error, isLoading, setFlags } = useFlagInit(
    sdkRef,
    initialFlags
  );

  useEffect(() => {
    if (!sdkRef.current) return;

    // wait for the flags to resolve before establishing the ws connection, because cookies :(
    if (isLoading) return;

    const sdk = sdkRef.current;
    sdk.onFlagUpdate(setFlags);

    return () => {
      sdk.disconnect();
    };
  }, [isLoading]);

  if (onlyRenderWhenReady && isLoading) {
    return null;
  }

  const providerValue = { flags, isLoading, error };

  return (
    <ProgressivelyContext.Provider value={providerValue}>
      {children}
    </ProgressivelyContext.Provider>
  );
};
