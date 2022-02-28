"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hAnalyticsNetworking = void 0;
class hAnalyticsNetworking {
    static identify() {
        return __awaiter(this, void 0, void 0, function* () {
            const config = this.getConfig();
            return fetch(config.endpointURL + "/identify", {
                method: "POST",
                headers: Object.assign({ "Content-Type": "application/json" }, config.httpHeaders),
                body: JSON.stringify({
                    trackingId: config.deviceId,
                }),
            }).then((res) => res.json());
        });
    }
    static send(event) {
        return __awaiter(this, void 0, void 0, function* () {
            this.sendHook(event);
            const config = this.getConfig();
            const context = config.context;
            if (!context) {
                console.warn("[hAnalytics] Context not setup, set hAnalyticsNetworking.context");
                return;
            }
            return fetch(config.endpointURL + "/collect", {
                method: "POST",
                headers: Object.assign({ "Content-Type": "application/json" }, config.httpHeaders),
                body: JSON.stringify({
                    event: event,
                    context: context,
                }),
            }).then((res) => res.json());
        });
    }
}
exports.hAnalyticsNetworking = hAnalyticsNetworking;
// allows defining other locations to send events too
hAnalyticsNetworking.sendHook = () => { };
