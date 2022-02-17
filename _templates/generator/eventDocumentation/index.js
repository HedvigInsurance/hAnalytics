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
    const hasEvent = async (os) => {
      const query = `
        SELECT
            count(*) as count
        FROM \`${bigQueryConfig.projectId}.${bigQueryConfig.dataset}.${event.name}\`
        WHERE context_os_name="${os}" AND EXTRACT(DATE FROM timestamp) >= DATE_ADD(CURRENT_DATE(), INTERVAL -30 DAY)
      `;

      const [rows] = await bigQueryConfig.bigquery
        .dataset(bigQueryConfig.dataset)
        .table(event.name)
        .query({
          query: query,
        });

      return rows[0].count > 0;
    };

    const hasIOSEvent = await hasEvent("iOS");
    const hasAndroidEvent = await hasEvent("Android");

    return {
      ios: hasIOSEvent,
      android: hasAndroidEvent,
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

    return {
      event,
      schemaFields: await eventToSchemaFields(event, bigQueryConfig),
      graphqlResults: graphqlResults,
      file: args.path.replace(".yml", ""),
      integrationStatus: await getIntegrationStatus(event),
      ...typeMaps,
    };
  },
};
