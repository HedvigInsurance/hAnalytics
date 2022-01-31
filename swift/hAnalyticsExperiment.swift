import Foundation

public struct hAnalyticsExperiment {
  // loads all experiments from server
  public static func load(onComplete: @escaping () -> Void) {
    hAnalyticsNetworking.loadExperiments(onComplete: onComplete)
  }

  /// Is the forever february campaign activated
  public static var foreverFebruaryCampaign: Bool {
    if let experiment = hAnalyticsNetworking.experimentsPayload.first(where: { experiment in
      experiment["name"] == "forever_february_campaign"
    }), let enabled = experiment["enabled"] as? Bool {
      hAnalyticsEvent.experimentEvaluated(
        name: "forever_february_campaign",
        enabled: enabled,
        variant: nil
      ).send()
      return enabled
    }

    hAnalyticsEvent.experimentEvaluated(
      name: "forever_february_campaign",
      enabled: false,
      variant: nil
    ).send()

    return false
  }

  /// Is the key gear feature activated
  public static var keyGear: Bool {
    if let experiment = hAnalyticsNetworking.experimentsPayload.first(where: { experiment in
      experiment["name"] == "key_gear"
    }), let enabled = experiment["enabled"] as? Bool {
      hAnalyticsEvent.experimentEvaluated(name: "key_gear", enabled: enabled, variant: nil).send()
      return enabled
    }

    hAnalyticsEvent.experimentEvaluated(name: "key_gear", enabled: false, variant: nil).send()

    return false
  }

}
