import { hAnalyticsContext } from "./hAnalyticsContext";
export declare type hAnalyticsConfig = {
    httpHeaders: {
        [name: string]: string;
    };
    deviceId: string;
    endpointURL: string;
    context: hAnalyticsContext;
};
