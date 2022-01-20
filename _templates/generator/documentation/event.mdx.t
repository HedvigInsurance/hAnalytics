---
to: docs/docs/<%= file %>.mdx
---
import { GithubStatus } from '../../../src/components/GithubStatus'

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

## Integration status

| Platform      | Status |
| ----------- | ----------- |
| iOS      | <GithubStatus query="hAnalyticsEvent.<%= event.accessor %> in:file repo:HedvigInsurance/Ugglan" />       |
| Android      | <GithubStatus query="hAnalyticsEvent.Companion.<%= event.accessor %> in:file repo:HedvigInsurance/Android" />       |