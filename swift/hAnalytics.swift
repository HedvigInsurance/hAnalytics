import Foundation
import JMESPath

public struct hAnalyticsEvent {
  public let name: String
  public let properties: [String: Any?]
  public let graphql: [String: Any]?

  public init(name: String, properties: [String: Any?], graphql: [String: Any]? = nil) {
    self.name = name
    self.properties = properties
    self.graphql = graphql
  }
}

public struct AnalyticsClosure {
  /// sends the event instantly
  public let send: () -> Void
}

extension hAnalyticsEvent {

  /// When a claim card has been clicked on screen
  public static func claimCardClick(claimId: String, claimStatus: String) -> AnalyticsClosure {
    return AnalyticsClosure {
      let properties: [String: Any?] = ["claim_id": claimId, "claim_status": claimStatus]

      hAnalyticsNetworking.send(hAnalyticsEvent(name: "claim_card_click", properties: properties))
    }
  }

  /// When a claim card has been shown on screen
  public static func claimCardVisible(claimId: String, claimStatus: String) -> AnalyticsClosure {
    return AnalyticsClosure {
      let properties: [String: Any?] = ["claim_id": claimId, "claim_status": claimStatus]

      hAnalyticsNetworking.send(hAnalyticsEvent(name: "claim_card_visible", properties: properties))
    }
  }

  /// When contact chat is tapped on claim details
  public static func claimDetailClickOpenChat(claimId: String, claimStatus: String)
    -> AnalyticsClosure
  {
    return AnalyticsClosure {
      let properties: [String: Any?] = ["claim_id": claimId, "claim_status": claimStatus]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(name: "claim_status_detail_click_open_chat", properties: properties)
      )
    }
  }

  /// When a claims recording has been played in the claims status screen
  public static func claimsDetailRecordingPlayed(claimId: String) -> AnalyticsClosure {
    return AnalyticsClosure {
      let properties: [String: Any?] = ["claim_id": claimId]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(name: "claims_detail_recording_played", properties: properties)
      )
    }
  }

  /// When the claims status detail screen is shown
  public static func claimsStatusDetailScreenView(claimId: String, claimStatus: String)
    -> AnalyticsClosure
  {
    return AnalyticsClosure {
      let properties: [String: Any?] = ["claim_id": claimId, "claim_status": claimStatus]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(name: "claims_status_detail_screen_view", properties: properties)
      )
    }
  }

  /// When quotes are signed in the offer screen
  public static func quotesSigned(quoteIds: [String]) -> AnalyticsClosure {
    return AnalyticsClosure {
      let properties: [String: Any?] = ["quote_ids": quoteIds]

      let graphQLVariables: [String: Any?] = ["quote_ids": quoteIds]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(
          name: "quotes_signed",
          properties: properties,
          graphql: [
            "query": """
              query QuotesSigned($quote_ids: [ID!]!) {
              	quoteBundle(input: {
              		ids: $quote_ids
              	}) {
              		quotes {
              			typeOfContract
              			initiatedFrom
              		}
              	}
              }
              """,
            "selectors": [
              [
                "name": "type_of_contracts",
                "path": "quoteBundle.quotes[*].typeOfContract | sort(@) | join(', ', @)",
              ], ["name": "initiated_from", "path": "quoteBundle.quotes[0].initiatedFrom"],
            ], "variables": graphQLVariables,
          ]
        )
      )
    }
  }

  /// When an embark flow is choosen on the choose screen
  public static func onboardingChooseEmbarkFlow(embarkStoryId: String) -> AnalyticsClosure {
    return AnalyticsClosure {
      let properties: [String: Any?] = ["embark_story_id": embarkStoryId]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(name: "onboarding_choose_embark_flow", properties: properties)
      )
    }
  }

  /// When Offer screen is shown
  public static func screenViewOffer(offerIds: [String]) -> AnalyticsClosure {
    return AnalyticsClosure {
      let properties: [String: Any?] = ["offer_ids": offerIds]

      let graphQLVariables: [String: Any?] = ["offer_ids": offerIds]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(
          name: "screen_view_offer",
          properties: properties,
          graphql: [
            "query": """
              query ScreenViewOffer($offer_ids: [ID!]!) {
              	quoteBundle(input: {
              		ids: $offer_ids
              	}) {
              		quotes {
              			typeOfContract
              			initiatedFrom
              		}
              	}
              }
              """,
            "selectors": [
              [
                "name": "type_of_contracts",
                "path": "quoteBundle.quotes[*].typeOfContract | sort(@) | join(', ', @)",
              ], ["name": "initiated_from", "path": "quoteBundle.quotes[0].initiatedFrom"],
            ], "variables": graphQLVariables,
          ]
        )
      )
    }
  }

  /// A payment card was shown on the home screen
  public static func homePaymentCardVisible() -> AnalyticsClosure {
    return AnalyticsClosure {
      let properties: [String: Any?] = [:]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(name: "home_payment_card_visible", properties: properties)
      )
    }
  }

  /// Connecting payment with Adyen screen was shown
  public static func screenViewConnectPaymentAdyen() -> AnalyticsClosure {
    return AnalyticsClosure {
      let properties: [String: Any?] = [:]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(name: "screen_view_connect_payment_adyen", properties: properties)
      )
    }
  }

  /// When payment connection did fail
  public static func screenViewConnectPaymentFailed() -> AnalyticsClosure {
    return AnalyticsClosure {
      let properties: [String: Any?] = [:]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(name: "screen_view_connect_payment_failed", properties: properties)
      )
    }
  }

  /// When payment was connected successfully
  public static func screenViewConnectPaymentSuccess() -> AnalyticsClosure {
    return AnalyticsClosure {
      let properties: [String: Any?] = [:]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(name: "screen_view_connect_payment_success", properties: properties)
      )
    }
  }

  /// Connecting payment with Trustly screen was shown
  public static func screenViewConnectPaymentTrustly() -> AnalyticsClosure {
    return AnalyticsClosure {
      let properties: [String: Any?] = [:]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(name: "screen_view_connect_payment_trustly", properties: properties)
      )
    }
  }

  /// When the detail screen of a cross sell is shown
  public static func screenViewCrossSellDetail(typeOfContract: String) -> AnalyticsClosure {
    return AnalyticsClosure {
      let properties: [String: Any?] = ["type_of_contract": typeOfContract]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(name: "screen_view_cross_sell_detail", properties: properties)
      )
    }
  }

  /// When Hedvig Forever is shown
  public static func screenViewForever() -> AnalyticsClosure {
    return AnalyticsClosure {
      let properties: [String: Any?] = [:]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(name: "screen_view_forever", properties: properties)
      )
    }
  }

  /// When Home tab is shown
  public static func screenViewHome() -> AnalyticsClosure {
    return AnalyticsClosure {
      let properties: [String: Any?] = [:]

      hAnalyticsNetworking.send(hAnalyticsEvent(name: "screen_view_home", properties: properties))
    }
  }

  /// When detail screen of an insurance is shown
  public static func screenViewInsuranceDetail(contractId: String) -> AnalyticsClosure {
    return AnalyticsClosure {
      let properties: [String: Any?] = ["contract_id": contractId]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(name: "screen_view_insurance_detail", properties: properties)
      )
    }
  }

  /// When Insurances tab is shown
  public static func screenViewInsurances() -> AnalyticsClosure {
    return AnalyticsClosure {
      let properties: [String: Any?] = [:]

      let graphQLVariables: [String: Any?] = [:]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(
          name: "screen_view_insurances",
          properties: properties,
          graphql: [
            "query": """
              query ScreenViewInsurances {
              	contracts {
              		typeOfContract
              	}
              }
              """,
            "selectors": [
              [
                "name": "has_accident_insurance",
                "path":
                  "(contracts[?contains(typeOfContract, 'ACCIDENT') == `true`] && true) == true",
              ],
              [
                "name": "has_home_insurance",
                "path":
                  "((contracts[?contains(typeOfContract, 'HOME') == `true`] || contracts[?contains(typeOfContract, 'APARTMENT') == `true`] || contracts[?contains(typeOfContract, 'HOUSE') == `true`]) && true) == true",
              ],
            ], "variables": graphQLVariables,
          ]
        )
      )
    }
  }

  /// When moving flow intro screen is shown
  public static func screenViewMovingFlowIntro() -> AnalyticsClosure {
    return AnalyticsClosure {
      let properties: [String: Any?] = [:]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(name: "screen_view_moving_flow_intro", properties: properties)
      )
    }
  }

  /// When Profile tab is shown
  public static func screenViewProfile() -> AnalyticsClosure {
    return AnalyticsClosure {
      let properties: [String: Any?] = [:]

      hAnalyticsNetworking.send(
        hAnalyticsEvent(name: "screen_view_profile", properties: properties)
      )
    }
  }

}
