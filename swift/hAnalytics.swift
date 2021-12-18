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

  /// When Home tab is shown
  public static func screenViewHome() -> AnalyticsClosure {
    return AnalyticsClosure {
      let properties: [String: Any?] = [:]

      hAnalyticsProviders.sendEvent(
        hAnalyticsEvent(name: "screen_view_home", properties: properties)
      )
    }
  }

  /// When Insurances tab is shown
  public static func screenViewInsurances() -> AnalyticsClosure {
    return AnalyticsClosure {
      let properties: [String: Any?] = [:]

      hAnalyticsProviders.sendEvent(
        hAnalyticsEvent(name: "screen_view_insurances", properties: properties)
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

  /// When Profile tab is shown
  public static func screenViewProfile() -> AnalyticsClosure {
    return AnalyticsClosure {
      let properties: [String: Any?] = [:]

      hAnalyticsProviders.sendEvent(
        hAnalyticsEvent(name: "screen_view_profile", properties: properties)
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

}
