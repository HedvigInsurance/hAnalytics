import { hAnalyticsTrackers } from "./hAnalyticsTrackers";
import { hAnalyticsExperiment } from "./hAnalyticsExperiment";
import { hAnalyticsNetworking } from "./hAnalyticsNetworking";

export class hAnalyticsExperiments {
  private trackers: hAnalyticsTrackers;
  private networking: hAnalyticsNetworking;
  loading: boolean = true;

  constructor(
    trackers: hAnalyticsTrackers,
    networking: hAnalyticsNetworking,
    bootstrapList?: hAnalyticsExperiment[]
  ) {
    this.trackers = trackers;
    this.networking = networking;
    this.networking.bootstrapExperiments(bootstrapList);
    this.loading = bootstrapList ? false : true;
  }

  // loads all experiments from server
  async load(): Promise<hAnalyticsExperiment[]> {
    const list = await this.networking.loadExperiments([
      "allow_external_data_collection",
      "connect_payment_reminder",
      "forever",
      "forever_february_campaign",
      "french_market",
      "home_common_claim",
      "key_gear",
      "login_method",
      "moving_flow",
      "payment_screen",
      "payment_type",
      "post_onboarding_show_payment_step",
      "show_charity",
      "update_necessary",
      "use_hedvig_letters_font",
      "use_quote_cart",
    ]);
    this.loading = false;
    return list;
  }

  /// no description given
  allowExternalDataCollection(): boolean {
    const experiment = this.networking.findExperimentByName(
      "allow_external_data_collection"
    );
    const variant = experiment.variant;

    if (variant) {
      this.trackers.experimentEvaluated(
        "allow_external_data_collection",
        variant
      );

      return variant == "enabled";
    }

    this.trackers.experimentEvaluated(
      "allow_external_data_collection",
      "disabled"
    );

    return false;
  }

  /// no description given
  homeCommonClaim(): boolean {
    const experiment =
      this.networking.findExperimentByName("home_common_claim");
    const variant = experiment.variant;

    if (variant) {
      this.trackers.experimentEvaluated("home_common_claim", variant);

      return variant == "enabled";
    }

    this.trackers.experimentEvaluated("home_common_claim", "enabled");

    return true;
  }
}
