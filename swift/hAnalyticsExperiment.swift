import Foundation

/// Forever extra compensation february 2022 campaign
public enum ForeverFebruaryCampaign: String {
  case enabled = "enabled"
  case disabled = "disabled"
}

/// Key gear feature available in app
public enum KeyGear: String {
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

    let variation = ForeverFebruaryCampaign.disabled

    hAnalyticsEvent.experimentShown(
      name: "forever_february_campaign",
      variation: variation.rawValue
    ).send()

    // fall back to default: disabled
    return variation
  }

  /// Key gear feature available in app
  public static func keyGear() -> KeyGear {
    if let experiment = hAnalyticsNetworking.experimentsPayload.first(where: { experiment in
      experiment["name"] == "key_gear"
    }), let variation = KeyGear(rawValue: experiment["variation"] ?? "") {
      hAnalyticsEvent.experimentShown(name: "key_gear", variation: variation.rawValue).send()
      return variation
    }

    let variation = KeyGear.disabled

    hAnalyticsEvent.experimentShown(name: "key_gear", variation: variation.rawValue).send()

    // fall back to default: disabled
    return variation
  }

}
