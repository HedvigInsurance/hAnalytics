const yaml = require("js-yaml");
const fs = require("fs");
const { format } = require("graphql-formatter");
const glob = require("glob");
const typeMaps = require("../../../commons/typeMaps");
const mockRunGraphQLQuery = require("../../../commons/mockRunGraphqlEvent");

const capitalizeFirstLetter = (s) => `${s[0].toUpperCase()}${s.slice(1)}`;

module.exports = {
  params: async () => {
    const importEvent = async (importPath) => {
      const event = yaml.load(fs.readFileSync(importPath, "utf8"));

      const graphqlResults = await mockRunGraphQLQuery(event);

      graphqlResults.forEach((result) => {
        console.log(`Result for JMESPath: "${result.path}": ${result.result}`);
      });

      return event;
    };

    const events = await new Promise((resolve) => {
      glob("events/**/*.yml", {}, async (_, files) => {
        const events = await Promise.all(files.map(importEvent));
        resolve(events);
      });
    });

    const importExperiment = async (importPath) => {
      const experiment = yaml.load(fs.readFileSync(importPath, "utf8"));
      return {
        ...experiment,
        enumName: capitalizeFirstLetter(experiment.accessor),
      };
    };

    const experiments = await new Promise((resolve) => {
      glob("experiments/**/*.yml", {}, async (_, files) => {
        const experiments = await Promise.all(files.map(importExperiment));
        resolve(experiments);
      });
    });

    const mapSwiftVariant = (variant) => {
      if (!variant) {
        return variant;
      }

      return {
        ...variant,
        caseWithAssociatedValues: (() => {
          if (variant.associatedValues) {
            const associatedValuesString = Object.keys(
              variant.associatedValues
            ).map(
              (associatedValueKey) =>
                `${associatedValueKey}: ${typeMaps.swiftTypeMap(
                  variant.associatedValues[associatedValueKey].type
                )}`
            );
            return `${variant.case}(${associatedValuesString})`;
          }

          return variant.case;
        })(),
        caseWithAssociatedValuesConstructor: (() => {
          if (variant.associatedValues) {
            const associatedValuesString = Object.keys(
              variant.associatedValues
            ).map(
              (associatedValueKey) =>
                `${associatedValueKey}: ${associatedValueKey}`
            );
            return `${variant.case}(${associatedValuesString})`;
          }

          return variant.case;
        })(),
        decoderValuesString: Object.keys(variant.associatedValues || {})
          .map((key) => {
            if (variant.associatedValues[key].type === "Double") {
              return `let ${key} = (associatedValues["${variant.associatedValues[key].name}"] as? NSNumber)?.doubleValue`;
            }
            return `let ${key} = associatedValues["${variant.associatedValues[key].name}"] as? ${variant.associatedValues[key].type}`;
          })
          .join(", "),
      };
    };

    const mapSwiftDefaultFallback = (defaultFallback) => {
      if (!defaultFallback) {
        return defaultFallback;
      }

      return {
        ...defaultFallback,
        caseWithAssociatedValues: (() => {
          if (defaultFallback.associatedValues) {
            const associatedValuesString = Object.keys(
              defaultFallback.associatedValues
            ).map(
              (associatedValueKey) =>
                `${associatedValueKey}: ${defaultFallback.associatedValues[associatedValueKey].value}`
            );
            return `${defaultFallback.case}(${associatedValuesString})`;
          }

          return defaultFallback.case;
        })(),
      };
    };

    return {
      events: events,
      experiments: {
        swift: experiments
          .filter((experiment) => experiment.targets.includes("Swift"))
          .map((experiment) => ({
            ...experiment,
            defaultFallback: mapSwiftDefaultFallback(
              experiment.defaultFallback
            ),
            variants: experiment.variants.map(mapSwiftVariant),
          })),
        kotlin: experiments.filter((experiment) =>
          experiment.targets.includes("Kotlin")
        ),
      },
      ...typeMaps,
      formatGQL: (string) => format(string),
    };
  },
};
