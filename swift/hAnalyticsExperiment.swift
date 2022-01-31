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
    }) {
      hAnalyticsEvent.experimentEvaluated(
        name: "forever_february_campaign",
        variant: experiment["variant"]
      ).send()
      return experiment["variant"] == "enabled"
    }

    hAnalyticsEvent.experimentEvaluated(name: "forever_february_campaign", variant: "disabled")
      .send()

    return false
  }

  /// Is the key gear feature activated
  public static var keyGear: Bool {
    if let experiment = hAnalyticsNetworking.experimentsPayload.first(where: { experiment in
      experiment["name"] == "key_gear"
    }) {
      hAnalyticsEvent.experimentEvaluated(name: "key_gear", variant: experiment["variant"]).send()
      return experiment["variant"] == "enabled"
    }

    hAnalyticsEvent.experimentEvaluated(name: "key_gear", variant: "disabled").send()

    return false
  }

}
