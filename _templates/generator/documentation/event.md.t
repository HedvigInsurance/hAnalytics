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
    (event.graphql?.selectors ?? []).map(selector => ({ name: selector.name, type: "Any" }))
].flatMap(i => i).map(input => `| ${input.name}      | ${input.type}       |`).join("\r\n")
%>

## Swift

```swift
hAnalyticsEvent.<%= event.accessor %>(<%= (event.inputs ?? []).map((input) => `${input.argument}: ${swiftTypeMap[input.type]}`).join(",") %>)
```