require("dd-trace").init();
require("dotenv").config();

const express = require("express");
const { request, gql } = require("graphql-request");
const jmespath = require("jmespath");
const uuid = require("uuid");
const bqAnalytics = require("./bigquery/analytics");
const cors = require("cors");

const app = express();
const port = process.env.PORT ?? 3034;

app.use(cors());
app.use(express.json());

const { getTraits } = require("./traits");
const { transformHeaders } = require("./tools");

app.post("/identify", async (req, res) => {
  try {
    const { trackingId } = req.body;

    console.log(`Identifiying ${trackingId}`);
    const traits = await getTraits(transformHeaders(req.headers));

    const eventId = uuid.v1();

    bqAnalytics.identify({
      trackingId,
      event: { id: eventId },
      properties: {
        member_id: traits?.member?.id || null,
      },
    });

    res.status(200).send("OK");
  } catch (err) {
    console.log("Failed to identify", err);
    res.status(500).send("SERVER ERROR");
  }
});

app.post("/collect", async (req, res) => {
  try {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const { context, event } = req.body;

    const timestamp = new Date();

    console.log(`Processing event from ${ip}: ${event}`);

    var allProperties = {
      ...event.properties,
    };

    if (event.graphql) {
      const forwardedHeaders = {
        authorization: req.headers["authorization"],
      };

      const query = gql`
        ${event.graphql.query}
      `;

      const graphqlData = await request(
        process.env.GRAPHQL_ENDPOINT,
        query,
        event.graphql.variables,
        forwardedHeaders
      );

      event.graphql.selectors.forEach((selector) => {
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
        name: event.name,
        timestamp,
      },
      context: {
        ...context,
        ip,
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
