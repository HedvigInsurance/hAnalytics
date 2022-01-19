const yaml = require('js-yaml');
const fs = require('fs');
const { format } = require("graphql-formatter")
const glob = require('glob')
const typeMaps = require('../../../commons/typeMaps')
const mockRunGraphQLQuery = require('../../../commons/mockRunGraphqlEvent')

const basename = __dirname + '/../../../'

module.exports = {
    params: async () => {
        const importEvent = async importPath => {
            const event = yaml.load(fs.readFileSync(basename + importPath, 'utf8'))

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

        return {
            events: events,
            ...typeMaps,
            formatGQL: (string) => format(string)
        }
    }
}