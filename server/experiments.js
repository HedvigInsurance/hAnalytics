const yaml = require("js-yaml");
const fs = require("fs");
const glob = require("glob");
const { initialize } = require("unleash-client");
const { getTraits } = require("./traits");
const { transformHeaders } = require("./tools");
const unleashConfig = require("../commons/unleashConfig");
const { getCustomContextProperties } = require("./custom-context-properties");

const unleashInstances = {};

const getUnleash = (appName) => {
  if (unleashInstances[appName]) {
    return unleashInstances[appName];
  }

  unleashInstances[appName] = initialize({
    ...unleashConfig,
    appName,
  });

  return unleashInstances[appName];
};

module.exports = (app) => {
  app.post("/experiments", async (req, res) => {
    const { trackingId, appName, appVersion, filter } = req.body;
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    const unleash = getUnleash(appName);

    const acceptsLanguage = req.acceptsLanguages()[0];

    const forwardedHeaders = transformHeaders(req.headers);

    const [traits, customContextProperties] = await Promise.all([
      getTraits(forwardedHeaders, true),
      getCustomContextProperties(forwardedHeaders),
    ]);

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

      // if a filter was specified and experiment wasn't requested, don't resolve it
      if (filter && !filter.includes(experiment.name)) {
        return null;
      }

      const unleashContext = {
        userId: trackingId,
        remoteAddress: ip,
        appName,
        appVersion,
        memberId: traits?.member?.id || null,
        memberOrTrackingId: traits?.member?.id || trackingId,
        locale: acceptsLanguage ?? null,
        market: acceptsLanguage.split("-")[1] ?? null,
        environment: unleashConfig.environment,
        ...customContextProperties,
      };

      if (experiment.variants.length == 0) {
        const isEnabled = unleash.isEnabled(experiment.name, unleashContext);

        return {
          name: experiment.name,
          variant: isEnabled ? "enabled" : "disabled",
        };
      }

      const activeVariant = unleash.getVariant(experiment.name, unleashContext);

      return {
        name: experiment.name,
        variant: activeVariant.name,
      };
    };

    const experiments = await new Promise((resolve) => {
      glob("definitions/experiments/**/*.yml", {}, async (_, files) => {
        const experiments = await Promise.all(files.map(evaluateExperiment));
        resolve(experiments.filter((i) => i));
      });
    });

    res.status(200).json(experiments);
  });
};
