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
  let name: String
  let properties: [String: Any]
}

public struct AnalyticsClosure { let send: () -> Void }

extension hAnalyticsEvent {

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

  public static func chooseInsuranceType(typeOfContract: String) -> AnalyticsClosure {
    return AnalyticsClosure {
      let properties: [String: Any] = ["type_of_contract": typeOfContract]

      hAnalyticsProviders.sendEvent(
        hAnalyticsEvent(
          name: "choose_insurance_type",
          properties: properties.compactMapValues { any in any as? hAnalyticsProperty }
        )
      )
    }
  }

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
