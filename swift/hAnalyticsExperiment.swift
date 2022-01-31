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
    }), let isEnabled = experiment["enabled"] as? Bool {
      hAnalyticsEvent.experimentEnabledEvaluated(
        name: "forever_february_campaign",
        isEnabled: isEnabled
      ).send()
      return isEnabled
    }

    return false
  }

  /// Is the key gear feature activated

  public static var keyGear: Bool {
    if let experiment = hAnalyticsNetworking.experimentsPayload.first(where: { experiment in
      experiment["name"] == "key_gear"
    }), let isEnabled = experiment["enabled"] as? Bool {
      hAnalyticsEvent.experimentEnabledEvaluated(name: "key_gear", isEnabled: isEnabled).send()
      return isEnabled
    }

    return false
  }

}
