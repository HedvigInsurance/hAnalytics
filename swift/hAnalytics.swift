import Foundation
import JMESPath

public struct hAnalyticsProviders {
  /// The function that is called when a tracking event should be sent
  /// Use this to integrate with analytics provider
  public static var sendEvent: (_ event: hAnalyticsEvent) -> Void = { _ in }

  /// The function that is called when a tracking event needs to perform a GraphQLQuery to enrich data
  public static var performGraphQLQuery:
    (_ query: String, _ variables: [String: Any?], _ onComplete: @escaping (_ data: Any?) -> Void)
      -> Void = { _, _, _ in }
}

public struct hAnalyticsEvent {
  public let name: String
  public let properties: [String: Any?]
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

      hAnalyticsProviders.sendEvent(
        hAnalyticsEvent(name: "claim_card_click", properties: properties)
      )
    }
  }

  /// When a claim card has been shown on screen
  public static func claimCardVisible(claimId: String) -> AnalyticsClosure {
    return AnalyticsClosure {
      let properties: [String: Any?] = ["claim_id": claimId]

      hAnalyticsProviders.sendEvent(
        hAnalyticsEvent(name: "claim_card_visible", properties: properties)
      )
    }
  }

  /// When a claims recording has been played in the claims status screen
  public static func claimsDetailRecordingPlayed(claimId: String) -> AnalyticsClosure {
    return AnalyticsClosure {
      let properties: [String: Any?] = ["claim_id": claimId]

      hAnalyticsProviders.sendEvent(
        hAnalyticsEvent(name: "claims_detail_recording_played", properties: properties)
      )
    }
  }

  /// When the claims status detail screen is shown
  public static func claimsStatusDetailScreenView(claimId: String) -> AnalyticsClosure {
    return AnalyticsClosure {
      let properties: [String: Any?] = ["claim_id": claimId]

      hAnalyticsProviders.sendEvent(
        hAnalyticsEvent(name: "claims_status_detail_screen_view", properties: properties)
      )
    }
  }

  /// When an embark flow is choosen on the choose screen
  public static func onboardingChooseEmbarkFlow(embarkStoryId: String) -> AnalyticsClosure {
    return AnalyticsClosure {
      let properties: [String: Any?] = ["embark_story_id": embarkStoryId]

      hAnalyticsProviders.sendEvent(
        hAnalyticsEvent(name: "onboarding_choose_embark_flow", properties: properties)
      )
    }
  }

  /// When Offer screen is shown
  public static func screenViewOffer(offerIds: [String]) -> AnalyticsClosure {
    return AnalyticsClosure {
      let properties: [String: Any?] = ["offer_ids": offerIds]

      let graphQLVariables: [String: Any?] = ["offer_ids": offerIds]

      hAnalyticsProviders.performGraphQLQuery(
        """
        query ScreenViewOffer($offer_ids: [ID!]!) {
        	quoteBundle(input: {
        		ids: $offer_ids
        	}) {
        		quotes {
        			typeOfContract
        		}
        	}
        }
        """,
        graphQLVariables
      ) { data in let graphqlProperties: [String: Any?]

        if let data = data {
          graphqlProperties = [
            "type_of_contracts": try?
              (try? JMESExpression.compile(
                "quoteBundle.quotes[*].typeOfContract | sort(@) | join(', ', @)"
              ))?.search(object: data)
          ]
        }
        else {
          graphqlProperties = [:]
        }

        hAnalyticsProviders.sendEvent(
          hAnalyticsEvent(
            name: "screen_view_offer",
            properties: properties.merging(graphqlProperties, uniquingKeysWith: { _, rhs in rhs })
          )
        )
      }
    }
  }

  /// When the detail screen of a cross sell is shown
  public static func screenViewCrossSellDetail(typeOfContract: String) -> AnalyticsClosure {
    return AnalyticsClosure {
      let properties: [String: Any?] = ["type_of_contract": typeOfContract]

      hAnalyticsProviders.sendEvent(
        hAnalyticsEvent(name: "screen_view_cross_sell_detail", properties: properties)
      )
    }
  }

  /// When Hedvig Forever is shown
  public static func screenViewForever() -> AnalyticsClosure {
    return AnalyticsClosure {
      let properties: [String: Any?] = [:]

      hAnalyticsProviders.sendEvent(
        hAnalyticsEvent(name: "screen_view_forever", properties: properties)
      )
    }
  }

  /// When Home tab is shown
  public static func screenViewHome() -> AnalyticsClosure {
    return AnalyticsClosure {
      let properties: [String: Any?] = [:]

      hAnalyticsProviders.sendEvent(
        hAnalyticsEvent(name: "screen_view_home", properties: properties)
      )
    }
  }

  /// When detail screen of an insurance is shown
  public static func screenViewInsuranceDetail(contractId: String) -> AnalyticsClosure {
    return AnalyticsClosure {
      let properties: [String: Any?] = ["contract_id": contractId]

      hAnalyticsProviders.sendEvent(
        hAnalyticsEvent(name: "screen_view_insurance_detail", properties: properties)
      )
    }
  }

  /// When Insurances tab is shown
  public static func screenViewInsurances() -> AnalyticsClosure {
    return AnalyticsClosure {
      let properties: [String: Any?] = [:]

      let graphQLVariables: [String: Any?] = [:]

      hAnalyticsProviders.performGraphQLQuery(
        """
        query ScreenViewInsurances {
        	contracts {
        		typeOfContract
        	}
        }
        """,
        graphQLVariables
      ) { data in let graphqlProperties: [String: Any?]

        if let data = data {
          graphqlProperties = [
            "has_accident_insurance": try?
              (try? JMESExpression.compile(
                "(contracts[?contains(typeOfContract, 'ACCIDENT') == `true`] && true) == true"
              ))?.search(object: data),
            "has_home_insurance": try?
              (try? JMESExpression.compile(
                "((contracts[?contains(typeOfContract, 'HOME') == `true`] || contracts[?contains(typeOfContract, 'APARTMENT') == `true`] || contracts[?contains(typeOfContract, 'HOUSE') == `true`]) && true) == true"
              ))?.search(object: data),
          ]
        }
        else {
          graphqlProperties = [:]
        }

        hAnalyticsProviders.sendEvent(
          hAnalyticsEvent(
            name: "screen_view_insurances",
            properties: properties.merging(graphqlProperties, uniquingKeysWith: { _, rhs in rhs })
          )
        )
      }
    }
  }

  /// When Profile tab is shown
  public static func screenViewProfile() -> AnalyticsClosure {
    return AnalyticsClosure {
      let properties: [String: Any?] = [:]

      hAnalyticsProviders.sendEvent(
        hAnalyticsEvent(name: "screen_view_profile", properties: properties)
      )
    }
  }

}
