import Foundation

public struct hAnalyticsProviders {
  /// The function that is called when a tracking event should be sent
  /// Use this to integrate with analytics provider
  public static var sendEvent:
    (_ name: String, _ properties: [String: hAnalyticsProperty]) -> Void = { _, _ in }

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

struct hAnalytics {

  public static func screenViewForever(numberOfReferrals: Int) {
    let properties: [String: Any] = ["NUMBER_OF_REFERRALS": numberOfReferrals, "HELLO": 0]

    hAnalyticsProviders.performGraphQLQuery(
      """
      query AnalyticsMemberID {
      member {
      id
      }
      }

      """,
      properties
    ) { data in
      let graphqlProperties = ["MEMBER_ID": data.getValue(at: "member.id")].compactMapValues { $0 }

      hAnalyticsProviders.sendEvent(
        "SCREEN_VIEW_FOREVER",
        properties.merging(graphqlProperties, uniquingKeysWith: { _, rhs in rhs }).compactMapValues
        { any in any as? hAnalyticsProperty }
      )
    }
  }

}
