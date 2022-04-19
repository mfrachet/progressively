export declare type FlagDict = {
    [key: string]: boolean;
};
export declare type Fields = Record<string, string | number | boolean>;
export interface SDKOptions {
    fields?: Fields;
    apiUrl?: string;
    websocketUrl?: string;
}
export interface RolloutSdkType {
    loadFlags: () => Promise<FlagDict>;
    disconnect: () => void;
    onFlagUpdate: (callback: (data: FlagDict) => void) => void;
}
