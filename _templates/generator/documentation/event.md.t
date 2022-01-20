---
to: docs/docs/<%= file %>.md
---
# <%= event.name %>
<%= event.description %>

## Attributes

| Name      | Type |
| ----------- | ----------- |
<%= [(event.inputs ?? []),
    (event.constants ?? []),
    (graphqlResults ?? []).map(result => ({ name: result.name, type: typeof result.result }))
].flatMap(i => i).map(input => `| ${input.name}      | ${input.type}       |`).join("\r\n")
%>

## Swift

```swift
hAnalyticsEvent.<%= event.accessor %>(<%= (event.inputs ?? []).map((input) => `${input.argument}: ${swiftTypeMap[input.type]}`).join(",") %>)
```

## Kotlin

```kotlin
hAnalyticsEvent.Companion.<%= event.accessor %>(<%= (event.inputs ?? []).map((input) => `${input.argument}: ${kotlinTypeMap[input.type]}`).join(",") %>)
```

## Integration status

| Platform      | Status |
| ----------- | ----------- |
| iOS      |    <%= integrationStatus.ios ? "Yes" : "No" %>    |
| Android      | <%= integrationStatus.android ? "Yes" : "No" %>       |

Integration status was last checked on <%= integrationStatus.lastUpdated %>