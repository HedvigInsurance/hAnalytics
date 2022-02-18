require("dd-trace").init();
require("dotenv").config();

const express = require("express");
const { request, gql } = require("graphql-request");
const jmespath = require("jmespath");
const Segment = require("analytics-node");
const uuid = require("uuid");
const segmentAnalytics = new Segment(process.env.SEGMENT_WRITE_KEY);
const bqAnalytics = require("./bigquery/analytics");
const app = express();
const port = process.env.PORT ?? 3034;

app.use(express.json());

const { getTraits } = require("./traits");
const { transformHeaders } = require("./tools");

app.post("/identify", async (req, res) => {
  try {
    const { trackingId } = req.body;

    console.log(`Identifiying ${trackingId}`);
    const traits = await getTraits(transformHeaders(req.headers));

    bqAnalytics.identify({
      trackingId,
      properties: {
        member_id: traits?.member?.id || null,
      },
    });

    segmentAnalytics.identify({
      userId: trackingId,
      traits: {
        member_id: traits?.member?.id || null,
      },
      context: {
        library: {
          name: "hAnalytics",
        },
      },
    });

    res.status(200).send("OK");
  } catch (err) {
    console.log("Failed to identify", err);
    res.status(500).send("SERVER ERROR");
  }
});

app.post("/event", async (req, res) => {
  try {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const {
      trackingId,
      sessionId,
      os,
      device,
      app,
      screen,
      locale: fallbackLocale,
      timezone,
      event,
      properties,
      graphql,
    } = req.body;

    const locale = req.acceptsLanguages()[0] ?? fallbackLocale;

    const timestamp = new Date();

    console.log(`Processing event from ${ip}: ${event}`);

    var allProperties = {
      ...properties,
    };

    if (graphql) {
      const forwardedHeaders = {
        authorization: req.headers["authorization"],
      };

      const query = gql`
        ${graphql.query}
      `;
      const selectors = graphql.selectors;

      const graphqlData = await request(
        process.env.GRAPHQL_ENDPOINT,
        query,
        graphql.variables,
        forwardedHeaders
      );

      selectors.forEach((selector) => {
        allProperties[selector.name] = jmespath.search(
          graphqlData,
          selector.path
        );
      });
    }

    const traits = await getTraits(transformHeaders(req.headers));
    const hanalyticsEventId = uuid.v1();

    bqAnalytics.track({
      properties: allProperties,
      event: {
        id: hanalyticsEventId,
        name: event,
        timestamp,
      },
      context: {
        timezone,
        session: {
          id: sessionId,
        },
        locale,
        ip,
        app: {
          name: app.name,
          version: app.version,
          build: app.build,
          namespace: app.namespace,
        },
        device: {
          manufacturer: device.manufacturer,
          model: device.model,
          name: device.name,
          type: device.type,
          id: trackingId,
          screen: {
            density: screen.density,
            height: screen.height,
            width: screen.width,
          },
          os: {
            name: os.name,
            version: os.version,
          },
        },
        traits: traits,
      },
    });

    segmentAnalytics.track({
      userId: trackingId,
      event,
      properties: allProperties,
      timestamp,
      context: {
        timezone,
        sessionId,
        os: {
          name: os.name,
          version: os.version,
        },
        locale,
        ip,
        app: {
          name: app.name,
          version: app.version,
          build: app.build,
          namespace: app.namespace,
        },
        device: {
          manufacturer: device.manufacturer,
          model: device.model,
          name: device.name,
          type: device.type,
          version: device.version,
          id: device.id,
        },
        screen: {
          density: screen.density,
          height: screen.height,
          width: screen.width,
        },
        hanalyticsEventId,
        traits: traits,
      },
    });

    console.log(`Event from ${ip} was processed: ${event}`);

    res.status(200).send("OK");
  } catch (err) {
    console.error("Failed to process event", err);
    res.status(400).send("BAD REQUEST");
  }
});

require("./experiments")(app);

app.listen(port, () => {
  console.log(`hAnalytics app listening on port ${port}`);
});
