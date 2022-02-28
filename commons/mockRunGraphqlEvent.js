const { addMocksToSchema } = require("@graphql-tools/mock");
const { introspectSchema } = require("@graphql-tools/wrap");
const { graphql, print } = require("graphql");
const fetch = require("cross-fetch");
const jmespath = require("jmespath");

const executor = async ({ document, variables }) => {
  const query = print(document);

  const fetchResult = await fetch("https://graphql.dev.hedvigit.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  return fetchResult.json();
};

const mockRunGraphQLQuery = async (query, variables) => {
  const schema = await introspectSchema(executor);
  const schemaWithMocks = addMocksToSchema({ schema });

  const result = await graphql(schemaWithMocks, query, null, null, variables);

  return result;
};

module.exports = async (event) => {
  if (!event.graphql) {
    return [];
  }

  const variables = [event.inputs ?? [], event.constants ?? []]
    .flatMap((i) => i)
    .filter((input) => (event.graphql.variables ?? []).includes(input.name))
    .reduce((prev, curr) => {
      switch (curr.type) {
        case "String":
          prev[curr.name] = "mock";
          break;
        case "Optional<String>":
          prev[curr.name] = "mock";
          break;
        case "Integer":
          prev[curr.name] = 20;
          break;
        case "Optional<Integer>":
          prev[curr.name] = 20;
          break;
        case "Boolean":
          prev[curr.name] = true;
          break;
        case "Optional<Boolean>":
          prev[curr.name] = true;
          break;
        case "Double":
          prev[curr.name] = 2.2;
          break;
        case "Optional<Double>":
          prev[curr.name] = 2.2;
          break;
        case "Array<String>":
          prev[curr.name] = ["mock"];
          break;
        case "Array<Integer>":
          return (prev[curr.name] = [20]);
          break;
        case "Array<Boolean>":
          prev[curr.name] = [true];
          break;
        case "Array<Double>":
          prev[curr.name] = [2.2];
        case "Array<Optional<String>>":
          prev[curr.name] = [null, "mock"];
          break;
        case "Array<Optional<Integer>>":
          prev[curr.name] = [null, 20];
          break;
        case "Array<Optional<Boolean>>":
          prev[curr.name] = [null, true];
          break;
        case "Array<Optional<Double>>":
          prev[curr.name] = [null, 2.2];
          break;
      }

      return prev;
    }, {});

  const result = await mockRunGraphQLQuery(
    event.graphql.query,
    variables ?? {}
  );

  if (result.errors) {
    console.log(result);
    throw `Invalid graphql: ${event.graphql.query} in ${basename + importPath}`;
  }

  return event.graphql.selectors.map((selector) => {
    return {
      path: selector.path,
      result: jmespath.search(result.data, selector.path),
      name: selector.name,
    };
  });
};
