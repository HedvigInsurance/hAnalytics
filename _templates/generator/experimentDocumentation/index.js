const yaml = require("js-yaml");
const fs = require("fs");
const typeMaps = require("../../../commons/typeMaps");
const { Octokit } = require("@octokit/core");

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const getIntegrationStatus = async (experiment) => {
  const lastUpdated = new Date()
    .toISOString()
    .replace(/T/, " ")
    .replace(/\..+/, "");

  try {
    const iosResult = await octokit.request("GET /search/code", {
      q: `hAnalyticsExperiment ${experiment.accessor} in:file repo:HedvigInsurance/Ugglan`,
    });

    const androidResult = await octokit.request("GET /search/code", {
      q: `hAnalyticsExperiment ${experiment.accessor} in:file repo:HedvigInsurance/Android`,
    });

    return {
      ios: iosResult.data.total_count > 0,
      android: androidResult.data.total_count > 0,
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
    const experiment = yaml.load(fs.readFileSync(args.path, "utf8"));

    return {
      experiment,
      file: args.path.replace(".yml", ""),
      integrationStatus: await getIntegrationStatus(experiment),
      ...typeMaps,
    };
  },
};
