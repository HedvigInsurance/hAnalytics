---
to: docs/docs/<%= file.replace("definitions/events/", "Definitions/Events/") %>.md
---
# <%= event.accessor %>
## <%= event.name %>
<%= event.description %>

## Schema

<%- schemaTable %>

<% if (event.accessor) { %>

<% if (event.targets.includes("Swift")) { %>

## Swift

```swift
hAnalyticsEvent.<%= event.accessor %>(<%- (event.inputs ?? []).map((input) => `${input.argument}: ${swiftTypeMap(input.type)}`).join(", ") %>)
```

<% } %>

<% if (event.targets.includes("Kotlin")) { %>

## Kotlin

```kotlin
hAnalytics.<%= event.accessor %>(<%- (event.inputs ?? []).map((input) => `${input.argument}: ${kotlinTypeMap(input.type)}`).join(", ") %>)
```

<% } %>


<% if (event.targets.includes("JS")) { %>

## Typescript

```typescript
hAnalyticsTrackers.<%= event.accessor %>(<%- (event.inputs ?? []).map((input) => `${input.argument}: ${swiftTypeMap(input.type)}`).join(", ") %>)
```

<% } %>

<% } %>

<% if (event.type !== "INTERNAL") { %>

## App status

| App      | Status |
| ----------- | ----------- |
| iOS      |    <%= integrationStatus.ios ? "Yes" : "No" %>    |
| Android      | <%= integrationStatus.android ? "Yes" : "No" %>       |
| Web-Onboarding      | <%= integrationStatus.webOnboarding ? "Yes" : "No" %>       |

Yes means that the platform has sent data atleast once in the last 30 days for this event.

App status was last checked on <%= integrationStatus.lastUpdated %>

<% } else { %>

## App status

This is an internal event, its automatically collected and managed by the `hAnalytics` server. As such it should be available always given its characteristics, see description for more info.

<% } %>