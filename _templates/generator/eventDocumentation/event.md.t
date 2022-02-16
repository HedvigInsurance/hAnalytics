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

<% if (event.type !== "INTERNAL") { %>

## Platform status

| Platform      | Status |
| ----------- | ----------- |
| iOS      |    <%= integrationStatus.ios ? "Yes" : "No" %>    |
| Android      | <%= integrationStatus.android ? "Yes" : "No" %>       |

Yes means that the platform has sent data atleast once in the last 30 days for this event.

Platform status was last checked on <%= integrationStatus.lastUpdated %>

<% } else { %>

## Platform status

This is an internal event, its automatically collected and managed by the `hAnalytics` server. As such it should be available always given its characteristics, see description for more info.

<% } %>