import Foundation

public struct hAnalyticsProviders {
  /// The function that is called when a tracking event should be sent
  /// Use this to integrate with analytics provider
  public static var sendEvent: (_ event: hAnalyticsEvent) -> Void = { _ in }

  /// The function that is called when a tracking event needs to perform a GraphQLQuery to enrich data
  public static var performGraphQLQuery:
    (
      _ query: String, _ variables: [String: Any?],
      _ onComplete: @escaping (_ data: ResultMap?) -> Void
    ) -> Void = { _, _, _ in }
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

  /// no description given
  public static func testGraphqlEvent(numberOfReferrals: String) -> AnalyticsClosure {
    return AnalyticsClosure {
      let properties: [String: Any?] = ["NUMBER_OF_REFERRALS": numberOfReferrals, "HELLO": 0]

      let graphQLVariables: [String: Any?] = ["NUMBER_OF_REFERRALS": numberOfReferrals]

      hAnalyticsProviders.performGraphQLQuery(
        """
        query AnalyticsMemberID($NUMBER_OF_REFERRALS: String!) {
        	angelStory(name: $NUMBER_OF_REFERRALS, locale: &#34;test&#34;) {
        		content
        	}
        }
        """,
        graphQLVariables
      ) { data in
        let graphqlProperties: [String: Any?] = ["MEMBER_ID": data?.getValue(at: "member.id")]

        hAnalyticsProviders.sendEvent(
          hAnalyticsEvent(
            name: "SCREEN_VIEW_FOREVER",
            properties: properties.merging(graphqlProperties, uniquingKeysWith: { _, rhs in rhs })
          )
        )
      }
    }
  }

}
