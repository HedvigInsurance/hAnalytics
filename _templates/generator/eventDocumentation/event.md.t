---
to: docs/docs/<%= file.replace("definitions/events/", "Definitions/Events/") %>.md
---
# <%= event.accessor %>
## <%= event.name %>
<%= event.description %>

## Schema

<details>

<summary>Read schema</summary>

| Name      | Mode | Type | Description |
| ----------- | ----------- | ----------- | ----------- |
<%= schemaFields.flatMap(i => i).map(input => `| ${input.name} | ${input.mode} | ${input.type} | ${input.description} |`).join("\r\n") %>

</details>

<% if (event.accessor) { %>

## Swift

```swift
hAnalyticsEvent.<%= event.accessor %>(<%- (event.inputs ?? []).map((input) => `${input.argument}: ${swiftTypeMap(input.type)}`).join(", ") %>)
```

## Kotlin

```kotlin
hAnalytics.<%= event.accessor %>(<%- (event.inputs ?? []).map((input) => `${input.argument}: ${kotlinTypeMap(input.type)}`).join(", ") %>)
```

<% } %>

## Integration status

| Platform      | Status |
| ----------- | ----------- |
| iOS      |    <%= integrationStatus.ios ? "Yes" : "No" %>    |
| Android      | <%= integrationStatus.android ? "Yes" : "No" %>       |

Yes means that the platform has sent data atleast once in the last 30 days for this event.

Integration status was last checked on <%= integrationStatus.lastUpdated %>