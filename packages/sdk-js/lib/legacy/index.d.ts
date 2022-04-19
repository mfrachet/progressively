import { RolloutSdkType, SDKOptions } from "./types";
export * from "./types";
declare function init(clientKey: string, options?: SDKOptions): RolloutSdkType;
declare const _default: {
    init: typeof init;
};
export default _default;
