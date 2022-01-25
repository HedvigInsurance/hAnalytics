const Analytics = require("analytics-node");
const express = require("express");
const { request, gql } = require("graphql-request");
const jmespath = require("jmespath");

const analytics = new Analytics(process.env.SEGMENT_WRITE_KEY);
const app = express();
const port = 3034;

app.use(express.json());

app.post("/event", async (req, res) => {
  try {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const {
      trackingId,
      os,
      device,
      app,
      screen,
      locale,
      timezone,
      event,
      properties,
      graphql,
    } = req.body;

    var allProperties = {
      ...properties,
    };

    if (graphql) {
      const query = gql`
        ${graphql.query}
      `;
      const selectors = graphql.selectors;

      const graphqlData = await request(
        process.env.GRAPHQL_ENDPOINT,
        query,
        graphql.variables,
        {
          authorization: req.headers["authorization"],
        }
      );

      selectors.forEach((selector) => {
        allProperties[selector.name] = jmespath.search(
          graphqlData,
          selector.path
        );
      });
    }

    analytics.track({
      userId: trackingId,
      event,
      properties: allProperties,
      context: {
        timezone,
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
        library: {
            name: "hAnalytics"
        },
        device: {
          manufacturer: device.manufacturer,
          model: device.model,
          name: device.name,
          type: device.type,
          version: device.version,
          id: device.id
        },
        screen: {
          density: screen.density,
          height: screen.height,
          width: screen.width,
        },
      },
    });

    res.status(200).send("OK");
  } catch (err) {
    res.status(400).send("BAD REQUEST");
  }
});

app.listen(port, () => {
  console.log(`hAnalytics app listening on port ${port}`);
});
