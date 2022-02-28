import { hAnalyticsTrackers } from "./hAnalyticsTrackers";
import { hAnalyticsNetworking } from "./hAnalyticsNetworking";

export class hAnalyticsExperiments {
  // loads all experiments from server
  static load(onLoad: (success: boolean) => void) {
    hAnalyticsNetworking.loadExperiments(
      [
        "allow_external_data_collection",
        "forever_february_campaign",
        "french_market",
        "key_gear",
        "login_method",
        "moving_flow",
        "payment_type",
        "post_onboarding_show_payment_step",
        "update_necessary",
      ],
      onLoad
    );
  }
}
