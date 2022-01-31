const yaml = require("js-yaml");
const fs = require("fs");
const glob = require("glob");
const { initialize, Strategy } = require("unleash-client");
const { getTraits } = require("./traits");

class MemberIdsStrategy extends Strategy {
  constructor() {
    super("MemberIds");
  }

  isEnabled(parameters, context) {
    return parameters.memberIds.includes(context.memberId);
  }
}

const unleash = initialize({
  url: process.env.UNLEASH_API_URL,
  appName: "hanalytics",
  customHeaders: {
    Authorization: process.env.UNLEASH_API_KEY,
  },
  strategies: [new MemberIdsStrategy()],
});

module.exports = (app) => {
  app.get("/experiments", async (req, res) => {
    const { trackingId } = req.body;
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    const forwardedHeaders = {
      authorization: req.headers["authorization"],
    };

    const traits = await getTraits(forwardedHeaders);

    const evaluateExperiment = async (importPath) => {
      const fileData = await new Promise((resolve, reject) => {
        fs.readFile(importPath, "utf8", (err, file) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(file);
        });
      });

      const experiment = yaml.load(fileData);

      const activeVariation = unleash.getVariant(experiment.name, {
        userId: trackingId,
        remoteAddress: ip,
        ...traits,
      });

      return {
        name: experiment.name,
        variation: activeVariation?.enabled
          ? activeVariation?.name
          : experiment.defaultVariation,
      };
    };

    const experiments = await new Promise((resolve) => {
      glob("experiments/**/*.yml", {}, async (_, files) => {
        const experiments = await Promise.all(files.map(evaluateExperiment));
        resolve(experiments);
      });
    });

    res.status(200).json(experiments);
  });
};
