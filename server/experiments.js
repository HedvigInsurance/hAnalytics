const yaml = require('js-yaml');
const fs = require('fs');
const glob = require('glob')
const { initialize } = require('unleash-client');

const unleash = initialize({
    url: process.env.UNLEASH_API_URL,
    appName: 'hanalytics',
    customHeaders: {
      Authorization: process.env.UNLEASH_API_KEY,
    },
});

module.exports = (app) => {
    app.get("/experiments", async (req, res) => {
        const { trackingId } = req.body
        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

        const evaluateExperiment = async importPath => {
            const fileData = await new Promise((resolve, reject) => {
                fs.readFile(importPath, 'utf8', (err, file) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    resolve(file)
                })
            })

            const experiment = yaml.load(fileData)

            const activeVariation = unleash.getVariant(experiment.name, {
                userId: trackingId,
                remoteAddress: ip
            })
            
            return {
                name: experiment.name,
                variation: activeVariation?.enabled ? activeVariation?.name : experiment.defaultVariation
            }
        }

        const experiments = await new Promise((resolve) => {
            glob("experiments/**/*.yml", {}, async (_, files) => {
                const experiments = await Promise.all(files.map(evaluateExperiment))
                resolve(experiments)
            })
        })

        res.status(200).json(experiments)
    })
}