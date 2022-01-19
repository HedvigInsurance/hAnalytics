---
to: docs/docs/events/<%= event.name %>.md
---

# <%= event.name %>
<%= event.description %>

## Parameters

| Name      | Type |
| ----------- | ----------- |
<%= [(event.inputs ?? []), (event.constants ?? [])].flatMap(i => i).map(input => `| ${input.name}      | ${input.type}       |`) %>
<%= (event.graphql?.selectors ?? []).map(input => `| ${input.name}      | Any       |`) %>
