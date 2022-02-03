import Foundation

public struct hAnalyticsExperiment {
  // loads all experiments from server
  public static func load(onComplete: @escaping (_ success: Bool) -> Void) {
    hAnalyticsNetworking.loadExperiments(onComplete: onComplete)
  }

  /// Should the french market be shown
  public static var frenchMarket: Bool {
    if let experiment = hAnalyticsNetworking.experimentsPayload.first(where: { experiment in
      experiment["name"] == "french_market"
    }), let variant = experiment["variant"] {
      hAnalyticsEvent.experimentEvaluated(name: "french_market", variant: variant).send()
      return variant == "enabled"
    }

    hAnalyticsEvent.experimentEvaluated(name: "french_market", variant: "disabled").send()

    return false
  }

  /// Is the key gear feature activated
  public static var keyGear: Bool {
    if let experiment = hAnalyticsNetworking.experimentsPayload.first(where: { experiment in
      experiment["name"] == "key_gear"
    }), let variant = experiment["variant"] {
      hAnalyticsEvent.experimentEvaluated(name: "key_gear", variant: variant).send()
      return variant == "enabled"
    }

    hAnalyticsEvent.experimentEvaluated(name: "key_gear", variant: "disabled").send()

    return false
  }

  /// Is moving flow activated
  public static var movingFlow: Bool {
    if let experiment = hAnalyticsNetworking.experimentsPayload.first(where: { experiment in
      experiment["name"] == "moving_flow"
    }), let variant = experiment["variant"] {
      hAnalyticsEvent.experimentEvaluated(name: "moving_flow", variant: variant).send()
      return variant == "enabled"
    }

    hAnalyticsEvent.experimentEvaluated(name: "moving_flow", variant: "disabled").send()

    return false
  }

}
