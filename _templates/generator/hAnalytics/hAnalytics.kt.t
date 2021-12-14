---
to: kotlin/hAnalytics.kt
---
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
<% events.forEach(function(event) { %>
   public static func <%= event.accessor %>(<%= event.inputs.map((input) => `${input.argument}: ${input.type}`) %>) {
       <% if(event.graphql) { %>
            AnalyticsSender.performGraphQLQuery("""
            <%= event.graphql.query %>
            """) { data in
                AnalyticsSender.sendEvent("<%= event.name %>", [
                    <% event.inputs.forEach(function(input) { %>
                            "<%= input.name %>": <%= input.argument %>,
                    <% }); %>
                    <% event.constants.forEach(function(constant) { %>
                            "<%= constant.name %>": <%= constant.value %>,
                    <% }); %>
                    <% event.graphql.getters.forEach(function(getter) { %>
                            "<%= getter.name %>": DeepFind(value: data).getValue(at: "<%= getter.getter %>"),
                    <% }); %>
                ].compactMapValues { $0 })
            }
       <% } else { %>
            AnalyticsSender.sendEvent("<%= event.name %>", [
                <% event.inputs.forEach(function(input) { %>
                        "<%= input.name %>": <%= input.argument %>,
                <% }); %>
                <% event.constants.forEach(function(constant) { %>
                        "<%= constant.name %>": <%= constant.value %>,
                <% }); %>
            ])
       <% } %>
   }
<% }) %>
}

