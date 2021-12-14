import Foundation

public struct hAnalyticsProviders {
  /// The function that is called when a tracking event should be sent
  /// Use this to integrate with analytics provider
  public static var sendEvent: (_ event: hAnalyticsEvent) -> Void = { _ in }

  /// The function that is called when a tracking event needs to perform a GraphQLQuery to enrich data
  public static var performGraphQLQuery:
    (
      _ query: String, _ variables: [String: Any],
      _ onComplete: @escaping (_ data: ResultMap) -> Void
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

public typealias AnalyticsClosure = () -> Void

struct hAnalytics {

  public static func screenViewForever(numberOfReferrals: Int) -> AnalyticsClosure {
    return {
      let properties: [String: Any] = ["NUMBER_OF_REFERRALS": numberOfReferrals, "HELLO": 0]

      hAnalyticsProviders.performGraphQLQuery(
        "query AnalyticsMemberID {  member {    id  }}",
        properties
      ) { data in
        let graphqlProperties = ["MEMBER_ID": data.getValue(at: "member.id")].compactMapValues {
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

  public static func helloHello() -> AnalyticsClosure {
    return {
      let properties: [String: Any] = [:]

      hAnalyticsProviders.sendEvent(
        hAnalyticsEvent(
          name: "HELLO_HELLO",
          properties: properties.compactMapValues { any in any as? hAnalyticsProperty }
        )
      )
    }
  }

}
