import { hAnalyticsConfig } from "./hAnalyticsConfig";
import { hAnalyticsEvent } from "./hAnalyticsEvent";
export declare class hAnalyticsNetworking {
    static getConfig: () => hAnalyticsConfig;
    static sendHook: (event: hAnalyticsEvent) => void;
    static identify(): Promise<any>;
    static send(event: hAnalyticsEvent): Promise<any>;
}
