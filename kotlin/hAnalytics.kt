import Foundation
import Apollo

public struct hAnalyticsProviders {
    /// The function that is called when a tracking event should be sent
    /// Use this to integrate with analytics provider
    public static var sendEvent: (_ name: String, _ properties: [String: hAnalyticsProperty]) -> Void = { _, _ in }
    public static var performGraphQLQuery: (_ query: String, onComplete: @escaping (_ data: Any) -> Void) -> Void = { _, _ in }
}

public protocol hAnalyticsProperty {}

extension Array: hAnalyticsProperty where Element: hAnalyticsProperty {}
extension String: hAnalyticsProperty {}
extension Float: hAnalyticsProperty {}
extension Int: hAnalyticsProperty {}
extension Date: hAnalyticsProperty {}

struct hAnalytics {

   public static func screenViewForever(numberOfReferrals: Int) {
       
            AnalyticsSender.performGraphQLQuery("""
            query AnalyticsMemberID {
  member {
    id
  }
}

            """) { data in
                AnalyticsSender.sendEvent("SCREEN_VIEW_FOREVER", [
                    
                            "NUMBER_OF_REFERRALS": numberOfReferrals,
                    
                    
                            "HELLO": 0,
                    
                    
                            "MEMBER_ID": DeepFind(value: data).getValue(at: "member.id"),
                    
                ].compactMapValues { $0 })
            }
       
   }

}

