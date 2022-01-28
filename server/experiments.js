const yaml = require('js-yaml');
const fs = require('fs');
const glob = require('glob')
const { getVariation } = require("./experimentTools")

module.exports = (app) => {
    app.get("/experiments", async (req, res) => {
        const { trackingId } = req.body

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

            const activeVariation = getVariation(experiment, trackingId)

            if (!activeVariation) {
                return null
            }
            
            return {
                name: experiment.name,
                variation: activeVariation.name
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