require('dd-trace').init();

const Analytics = require("analytics-node");
const express = require("express");
const { request, gql } = require("graphql-request");
const jmespath = require("jmespath");

const analytics = new Analytics(process.env.SEGMENT_WRITE_KEY);
const app = express();
const port = process.env.PORT ?? 3034;

app.use(express.json());

const { getTraits } = require("./traits")

app.post("/identify", async (req, res) => {
    try {
        const {
            trackingId
        } = req.body;

        console.log(`Identifiying ${trackingId}`)
    
        const forwardedHeaders = {
            authorization: req.headers["authorization"],
        }
    
        const traits = await getTraits(forwardedHeaders)
    
        analytics.identify({
            userId: trackingId,
            traits,
            context: {
                library: {
                    name: "hAnalytics"
                }
            }
        })
    } catch (err) {
        console.log("Failed to identify", err)
    }
})

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
      locale,
      timezone,
      event,
      properties,
      graphql,
    } = req.body;

    const timestamp = new Date();

    console.log(`Processing event from ${ip}: ${event}`);

    var allProperties = {
      ...properties,
    };

    const forwardedHeaders = {
        authorization: req.headers["authorization"],
    }

    if (graphql) {
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

    const traits = await getTraits(forwardedHeaders)

    analytics.track({
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
        library: {
          name: "hAnalytics",
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
        traits: traits
      },
    });

    console.log(`Event from ${ip} was processed: ${event}`);

    res.status(200).send("OK");
  } catch (err) {
    console.error("Failed to process event", err)
    res.status(400).send("BAD REQUEST");
  }
});

require("./experiments")(app)

app.listen(port, () => {
  console.log(`hAnalytics app listening on port ${port}`);
});
