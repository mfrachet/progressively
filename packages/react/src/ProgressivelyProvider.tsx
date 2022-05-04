import React, { useRef } from "react";
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
    ProgressivelySdk.init(clientKey, {
      fields,
      apiUrl,
      websocketUrl,
      initialFlags,
    })
  );

  const { flags, error, isLoading } = useFlagInit(sdkRef, initialFlags);

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
