import Foundation

/// Which login method to use
public enum LoginMethod: String {
  case bankIdSweden = "bank_id_sweden"
  case nemId = "nem_id"
  case otp = "otp"
  case bankIdNorway = "bank_id_norway"
}

/// Which payment provider to use
public enum PaymentType: String {
  case adyen = "adyen"
  case trustly = "trustly"
}

public struct hAnalyticsExperiment {
  // loads all experiments from server
  public static func load(onComplete: @escaping (_ success: Bool) -> Void) {
    hAnalyticsNetworking.loadExperiments(
      filter: [
        "allow_external_data_collection", "forever_february_campaign", "french_market", "key_gear",
        "login_method", "moving_flow", "payment_type", "post_onboarding_show_payment_step",
        "update_necessary", "use_hedvig_letters_font",
      ],
      onComplete: onComplete
    )
  }

  /// Allow fetching data with external data providers (for example insurely)
  public static var allowExternalDataCollection: Bool {
    if let experiment = hAnalyticsNetworking.experimentsPayload.first(where: { experiment in
      experiment["name"] == "allow_external_data_collection"
    }), let variant = experiment["variant"] {
      hAnalyticsEvent.experimentEvaluated(name: "allow_external_data_collection", variant: variant)
        .send()
      return variant == "enabled"
    }

    hAnalyticsEvent.experimentEvaluated(name: "allow_external_data_collection", variant: "disabled")
      .send()

    return false
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

  /// no description given
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

  /// no description given
  public static var paymentType: PaymentType {
    if let experiment = hAnalyticsNetworking.experimentsPayload.first(where: { experiment in
      experiment["name"] == "payment_type"
    }), let variant = PaymentType(rawValue: experiment["variant"] ?? "") {
      hAnalyticsEvent.experimentEvaluated(name: "payment_type", variant: variant.rawValue).send()
      return variant
    }

    hAnalyticsEvent.experimentEvaluated(name: "payment_type", variant: PaymentType.trustly.rawValue)
      .send()

    return .trustly
  }

  /// Show payment step in PostOnboarding
  public static var postOnboardingShowPaymentStep: Bool {
    if let experiment = hAnalyticsNetworking.experimentsPayload.first(where: { experiment in
      experiment["name"] == "post_onboarding_show_payment_step"
    }), let variant = experiment["variant"] {
      hAnalyticsEvent.experimentEvaluated(
        name: "post_onboarding_show_payment_step",
        variant: variant
      ).send()
      return variant == "enabled"
    }

    hAnalyticsEvent.experimentEvaluated(
      name: "post_onboarding_show_payment_step",
      variant: "disabled"
    ).send()

    return false
  }

  /// Defines the lowest supported app version. Should prompt a user to update if it uses an outdated version.
  public static var updateNecessary: Bool {
    if let experiment = hAnalyticsNetworking.experimentsPayload.first(where: { experiment in
      experiment["name"] == "update_necessary"
    }), let variant = experiment["variant"] {
      hAnalyticsEvent.experimentEvaluated(name: "update_necessary", variant: variant).send()
      return variant == "enabled"
    }

    hAnalyticsEvent.experimentEvaluated(name: "update_necessary", variant: "disabled").send()

    return false
  }

  /// Should we use new Hedvig Letters font
  public static var useHedvigLettersFont: Bool {
    if let experiment = hAnalyticsNetworking.experimentsPayload.first(where: { experiment in
      experiment["name"] == "use_hedvig_letters_font"
    }), let variant = experiment["variant"] {
      hAnalyticsEvent.experimentEvaluated(name: "use_hedvig_letters_font", variant: variant).send()
      return variant == "enabled"
    }

    hAnalyticsEvent.experimentEvaluated(name: "use_hedvig_letters_font", variant: "disabled").send()

    return false
  }

}
