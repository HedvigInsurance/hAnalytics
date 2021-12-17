import Foundation

public struct hAnalyticsProviders {
  /// The function that is called when a tracking event should be sent
  /// Use this to integrate with analytics provider
  public static var sendEvent: (_ event: hAnalyticsEvent) -> Void = { _ in }

  /// The function that is called when a tracking event needs to perform a GraphQLQuery to enrich data
  public static var performGraphQLQuery:
    (
      _ query: String, _ variables: [String: Any],
      _ onComplete: @escaping (_ data: ResultMap?) -> Void
    ) -> Void = { _, _, _ in }
}

public protocol hAnalyticsProperty {}

extension Array: hAnalyticsProperty where Element: hAnalyticsProperty {}
extension String: hAnalyticsProperty {}
extension Float: hAnalyticsProperty {}
extension Int: hAnalyticsProperty {}
extension Date: hAnalyticsProperty {}

public struct hAnalyticsEvent {
  public let name: String
  public let properties: [String: hAnalyticsProperty]
}

public struct AnalyticsClosure {
  public let send: () -> Void
}

extension hAnalyticsEvent {

  /// When Home tab is shown
  public static func screenViewHome() -> AnalyticsClosure {
    return AnalyticsClosure {
      let properties: [String: Any] = [:]

      hAnalyticsProviders.sendEvent(
        hAnalyticsEvent(
          name: "screen_view_home",
          properties: properties.compactMapValues { any in any as? hAnalyticsProperty }
        )
      )
    }
  }

  /// When Insurances tab is shown
  public static func screenViewInsurances() -> AnalyticsClosure {
    return AnalyticsClosure {
      let properties: [String: Any] = [:]

      hAnalyticsProviders.sendEvent(
        hAnalyticsEvent(
          name: "screen_view_insurances",
          properties: properties.compactMapValues { any in any as? hAnalyticsProperty }
        )
      )
    }
  }

  /// When Hedvig Forever is shown
  public static func screenViewForever() -> AnalyticsClosure {
    return AnalyticsClosure {
      let properties: [String: Any] = [:]

      hAnalyticsProviders.sendEvent(
        hAnalyticsEvent(
          name: "screen_view_forever",
          properties: properties.compactMapValues { any in any as? hAnalyticsProperty }
        )
      )
    }
  }

  /// When Profile tab is shown
  public static func screenViewProfile() -> AnalyticsClosure {
    return AnalyticsClosure {
      let properties: [String: Any] = [:]

      hAnalyticsProviders.sendEvent(
        hAnalyticsEvent(
          name: "screen_view_profile",
          properties: properties.compactMapValues { any in any as? hAnalyticsProperty }
        )
      )
    }
  }

  /// When an embark flow is choosen on the choose screen
  public static func onboardingChooseEmbarkFlow(embarkStoryId: String) -> AnalyticsClosure {
    return AnalyticsClosure {
      let properties: [String: Any] = ["embark_story_id": embarkStoryId]

      hAnalyticsProviders.sendEvent(
        hAnalyticsEvent(
          name: "onboarding_choose_embark_flow",
          properties: properties.compactMapValues { any in any as? hAnalyticsProperty }
        )
      )
    }
  }

  /// no description given
  public static func testGraphqlEvent(numberOfReferrals: Int) -> AnalyticsClosure {
    return AnalyticsClosure {
      let properties: [String: Any] = ["NUMBER_OF_REFERRALS": numberOfReferrals, "HELLO": 0]

      hAnalyticsProviders.performGraphQLQuery(
        "query AnalyticsMemberID {  member {    id  }}",
        properties
      ) { data in
        let graphqlProperties = ["MEMBER_ID": data?.getValue(at: "member.id")].compactMapValues {
          $0
        }

        hAnalyticsProviders.sendEvent(
          hAnalyticsEvent(
            name: "SCREEN_VIEW_FOREVER",
            properties: properties.merging(graphqlProperties, uniquingKeysWith: { _, rhs in rhs })
              .compactMapValues { any in any as? hAnalyticsProperty }
          )
        )
      }
    }
  }

}
