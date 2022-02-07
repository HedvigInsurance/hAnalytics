import Foundation

/// Which login method to use
public enum LoginMethod: String {
  case bankIdSweden = "bank_id_sweden"
  case otp = "otp"
  case simpleSign = "simple_sign"
  case disabled = "disabled"
}

/// Which payment provider to use
public enum PaymentType: String {
  case adyen = "adyen"
  case trustly = "trustly"
  case disabled = "disabled"
}

public struct hAnalyticsExperiment {
  // loads all experiments from server
  public static func load(onComplete: @escaping (_ success: Bool) -> Void) {
    hAnalyticsNetworking.loadExperiments(onComplete: onComplete)
  }

  /// Is the forever february campaign activated
  public static var foreverFebruaryCampaign: Bool {
    if let experiment = hAnalyticsNetworking.experimentsPayload.first(where: { experiment in
      experiment["name"] == "forever_february_campaign"
    }), let variant = experiment["variant"] {
      hAnalyticsEvent.experimentEvaluated(name: "forever_february_campaign", variant: variant)
        .send()
      return variant == "enabled"
    }

    hAnalyticsEvent.experimentEvaluated(name: "forever_february_campaign", variant: "disabled")
      .send()

    return false
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

  /// Which login method to use
  public static var loginMethod: LoginMethod {
    if let experiment = hAnalyticsNetworking.experimentsPayload.first(where: { experiment in
      experiment["name"] == "login_method"
    }), let variant = LoginMethod(rawValue: experiment["variant"] ?? "") {
      hAnalyticsEvent.experimentEvaluated(name: "login_method", variant: variant.rawValue).send()
      return variant
    }

    hAnalyticsEvent.experimentEvaluated(name: "login_method", variant: LoginMethod.otp.rawValue)
      .send()

    return .otp
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

  /// Which payment provider to use
  public static var paymentType: PaymentType {
    if let experiment = hAnalyticsNetworking.experimentsPayload.first(where: { experiment in
      experiment["name"] == "payment_type"
    }), let variant = PaymentType(rawValue: experiment["variant"] ?? "") {
      hAnalyticsEvent.experimentEvaluated(name: "payment_type", variant: variant.rawValue).send()
      return variant
    }

    hAnalyticsEvent.experimentEvaluated(name: "payment_type", variant: PaymentType.adyen.rawValue)
      .send()

    return .adyen
  }

}
