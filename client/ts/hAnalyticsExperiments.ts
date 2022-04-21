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
      "common_claims",
      "forever_february_campaign",
      "french_market",
      "key_gear",
      "login_method",
      "moving_flow",
      "payment_type",
      "post_onboarding_show_payment_step",
      "Qasa",
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
}
