const yaml = require("js-yaml");
const fs = require("fs");
const typeMaps = require("../../../commons/typeMaps");
const mockRunGraphQLQuery = require("../../../commons/mockRunGraphqlEvent");
const eventToSchemaFields = require("../../../server/bigquery/schema/eventToSchemaFields");
const bigQueryConfig = require("../../../server/bigquery/config");

const getIntegrationStatus = async (event) => {
  const lastUpdated = new Date()
    .toISOString()
    .replace(/T/, " ")
    .replace(/\..+/, "");

  try {
    const hasEvent = async (where) => {
      const query = `
        SELECT
            count(*) as count
        FROM \`${bigQueryConfig.projectId}.${bigQueryConfig.dataset}.${event.name}\`
        WHERE ${where} AND EXTRACT(DATE FROM event.timestamp) >= DATE_ADD(CURRENT_DATE(), INTERVAL -30 DAY)
      `;

      const [rows] = await bigQueryConfig.bigquery
        .dataset(bigQueryConfig.dataset)
        .table(event.name)
        .query({
          query: query,
        });

      return rows[0].count > 0;
    };

    const hasIOSEvent = await hasEvent(
      `context.app.name = "Hedvig" AND context.os.name = "iOS"`
    );
    const hasAndroidEvent = await hasEvent(
      `context.app.name = "Hedvig" AND context.os.name = "Android"`
    );

    const hasWebOnboardingEvent = await hasEvent(
      `context.app.name = "WebOnboarding"`
    );

    return {
      ios: hasIOSEvent,
      android: hasAndroidEvent,
      webOnboarding: hasWebOnboardingEvent,
      lastUpdated: lastUpdated,
    };
  } catch (err) {
    return {
      ios: false,
      android: false,
      lastUpdated: lastUpdated,
    };
  }
};

module.exports = {
  params: async ({ args }) => {
    const event = yaml.load(fs.readFileSync(args.path, "utf8"));

    const graphqlResults = await mockRunGraphQLQuery(event);

    const schemaFields = await eventToSchemaFields(event, bigQueryConfig);

    const generateSchemaTable = (fields, name, inlineContent = "") => `
<details>

<summary>${name}</summary>
${inlineContent}

#### Fields

${
  fields.filter((field) => !field.fields).length
    ? `
| Name      | Mode | Type | Description |
| ----------- | ----------- | ----------- | ----------- |`
    : ""
}
${fields
  .filter((field) => !field.fields)
  .map((field) => {
    const permittedValues = field.permittedValues?.join("<br />");

    return `| ${field.name} | ${field.mode} | ${
      permittedValues
        ? `<details><summary>Enum ${field.type}</summary>${permittedValues}</details>`
        : field.type
    } | ${field.description} |`;
  })
  .join("\r\n")}

${fields
  .filter((field) => field.fields?.length)
  .map((field) => {
    if (field.fields) {
      return generateSchemaTable(
        field.fields,
        `${field.name}`,
        `
| Name      | Mode | Type | Description |
| ----------- | ----------- | ----------- | ----------- |
| ${field.name} | ${field.mode} | ${field.type} | ${field.description} |
        `
      );
    }
  })
  .join("\r\n")}

</details>
    `;

    return {
      event,
      schemaTable: generateSchemaTable(schemaFields, "Schema"),
      graphqlResults: graphqlResults,
      file: args.path.replace(".yml", ""),
      integrationStatus: await getIntegrationStatus(event),
      ...typeMaps,
    };
  },
};
