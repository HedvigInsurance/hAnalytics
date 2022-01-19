---
to: docs/docs/<%= file %>.md
---

# <%= event.name %>
<%= event.description %>

## Parameters

| Name      | Type |
| ----------- | ----------- |
<%= [(event.inputs ?? []),
    (event.constants ?? []),
    (event.graphql?.selectors ?? []).map(selector => ({ name: selector.name, type: "Any" }))
].flatMap(i => i).map(input => `| ${input.name}      | ${input.type}       |`).join("\r\n")
%>