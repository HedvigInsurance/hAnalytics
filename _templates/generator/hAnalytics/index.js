const yaml = require('js-yaml');
const fs = require('fs');
const { format } = require("graphql-formatter")
const glob = require('glob')
const typeMaps = require('../../../commons/typeMaps')
const mockRunGraphQLQuery = require('../../../commons/mockRunGraphqlEvent');

const capitalizeFirstLetter = (s) => `${s[0].toUpperCase()}${s.slice(1)}`

module.exports = {
    params: async () => {
        const importEvent = async importPath => {
            const event = yaml.load(fs.readFileSync(importPath, 'utf8'))

            const graphqlResults = await mockRunGraphQLQuery(event)

            graphqlResults.forEach(result => {
                console.log(`Result for JMESPath: "${result.path}": ${result.result}`)
            });

            return event
        }

        const events = await new Promise((resolve) => {
            glob("events/**/*.yml", {}, async (_, files) => {
                const events = await Promise.all(files.map(importEvent))
                resolve(events)
            })
        })

        const importExperiment = async importPath => {
            const experiment = yaml.load(fs.readFileSync(importPath, 'utf8'))
            return {
                ...experiment,
                enumName: capitalizeFirstLetter(experiment.accessor)
            }
        }

        const experiments = await new Promise((resolve) => {
            glob("experiments/**/*.yml", {}, async (_, files) => {
                const experiments = await Promise.all(files.map(importExperiment))
                resolve(experiments)
            })
        })

        return {
            events: events,
            experiments: {
                swift: experiments.filter(experiment => experiment.targets.includes("Swift")),
                kotlin: experiments.filter(experiment => experiment.targets.includes("Kotlin"))
            },
            ...typeMaps,
            stringToSwiftComment: (s) =>
                s.split('\n').map((line) => `/// ${line}`).join('\n'),
            stringToKotlinComment: (s) =>
                s.split('\n').map((line) => `   * ${line}`).join('\n'),
            formatGQL: (string) => format(string)
        }
    }
}