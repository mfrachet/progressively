import ProgressivelySdk, { SDKOptions } from "@progressively/sdk-js";
import { ProgressivelyProviderProps } from "./types";

export function getSSRProps(
  clientKey: string,
  options?: SDKOptions | undefined
) {
  const sdk = ProgressivelytSdk.init(clientKey, options);

  return sdk.loadFlags().then((initialFlags) => ({
    initialFlags,
    clientKey,
    onlyRenderWhenReady: false,
    ...options,
  }));
}
