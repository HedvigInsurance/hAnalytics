const { format } = require("graphql-formatter");
const typeMaps = require("../../../commons/typeMaps");
const mockRunGraphQLQuery = require("../../../commons/mockRunGraphqlEvent");
const getEvents = require("../../../commons/getEvents");
const getExperiments = require("../../../commons/getExperiments");
const customTypes = require("../../../commons/customTypes");

const capitalizeFirstLetter = (s) => `${s[0].toUpperCase()}${s.slice(1)}`;

module.exports = {
  params: async () => {
    const mapEvent = async (event) => {
      if (!event.accessor) {
        return null;
      }

      const graphqlResults = await mockRunGraphQLQuery(event);

      graphqlResults.forEach((result) => {
        console.log(`Result for JMESPath: "${result.path}": ${result.result}`);
      });

      return event;
    };

    const events = (
      await Promise.all((await getEvents()).map(mapEvent))
    ).filter((i) => i);

    const mapExperiment = (experiment) => {
      return {
        ...experiment,
        enumName: capitalizeFirstLetter(experiment.accessor),
      };
    };

    const experiments = (await getExperiments()).map(mapExperiment);

    return {
      events,
      customTypes,
      experiments: {
        swift: experiments.filter((experiment) =>
          experiment.targets.includes("Swift")
        ),
        kotlin: experiments.filter((experiment) =>
          experiment.targets.includes("Kotlin")
        ),
      },
      capitalizeFirstLetter,
      swiftLiteral: (value, type) => {
        switch (type) {
          case "String":
          case "Optional<String>":
            return `"${value}"`;
          case "Boolean":
          case "Optional<Boolean>":
            return `${value}`;
          case "Double":
          case "Integer":
          case "Optional<Double>":
          case "Optional<Integer>":
            return `${value}`;
        }
      },
      kotlinLiteral: (value, type) => {
        switch (type) {
          case "String":
          case "Optional<String>":
            return `"${value}"`;
          case "Boolean":
          case "Optional<Boolean>":
            return `${value}`;
          case "Double":
          case "Integer":
          case "Optional<Double>":
          case "Optional<Integer>":
            return `${value}`;
        }
      },
      swiftInputToGetter: (input) => {
        const type = customTypes.find((type) => type.name === input.type);

        if (type) {
          return `${input.argument}.rawValue`;
        }

        return input.argument;
      },
      kotlinInputToGetter: (input) => {
        const type = customTypes.find((type) => type.name === input.type);

        if (type) {
          return `${input.argument}.value`;
        }

        return input.argument;
      },
      ...typeMaps,
      stringToSwiftComment: (s) =>
        s
          .split("\n")
          .map((line) => `/// ${line}`)
          .join("\n"),
      stringToKotlinComment: (s) =>
        s
          .split("\n")
          .map((line) => `   * ${line}`)
          .join("\n"),
      formatGQL: (string) => format(string),
    };
  },
};
