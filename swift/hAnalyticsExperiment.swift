import Foundation

/// Forever extra compensation february 2022 campaign
public enum ForeverFebruaryCampaign: String {
  case enabled = "enabled"
  case disabled = "disabled"
}

/// A weighted experiment
public enum WeightedExperiment: String {
  case enabled = "enabled"
  case disabled = "disabled"
}

public struct hAnalyticsExperiment {
  // loads all experiments from server
  public static func load(onComplete: @escaping () -> Void) {
    hAnalyticsNetworking.loadExperiments(onComplete: onComplete)
  }

  /// Forever extra compensation february 2022 campaign
  public static func foreverFebruaryCampaign() -> ForeverFebruaryCampaign {
    if let experiment = hAnalyticsNetworking.experimentsPayload.first(where: { experiment in
      experiment["name"] == "forever_february_campaign"
    }), let variation = ForeverFebruaryCampaign(rawValue: experiment["variation"] ?? "") {
      hAnalyticsEvent.experimentShown(
        name: "forever_february_campaign",
        variation: variation.rawValue
      ).send()
      return variation
    }

    let variation = ForeverFebruaryCampaign.enabled

    hAnalyticsEvent.experimentShown(
      name: "forever_february_campaign",
      variation: variation.rawValue
    ).send()

    // fall back to default: enabled
    return variation
  }

  /// A weighted experiment
  public static func weightedExperiment() -> WeightedExperiment {
    if let experiment = hAnalyticsNetworking.experimentsPayload.first(where: { experiment in
      experiment["name"] == "weighted_experiment_test"
    }), let variation = WeightedExperiment(rawValue: experiment["variation"] ?? "") {
      hAnalyticsEvent.experimentShown(
        name: "weighted_experiment_test",
        variation: variation.rawValue
      ).send()
      return variation
    }

    let variation = WeightedExperiment.disabled

    hAnalyticsEvent.experimentShown(name: "weighted_experiment_test", variation: variation.rawValue)
      .send()

    // fall back to default: disabled
    return variation
  }

}
