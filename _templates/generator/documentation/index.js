const yaml = require('js-yaml')
const fs = require('fs')
const typeMaps = require('../../../commons/typeMaps')
const mockRunGraphQLQuery = require('../../../commons/mock_run_graphql_event')

module.exports = {
    params: async ({ args }) => {

        const event = yaml.load(fs.readFileSync(args.path, 'utf8'))

        const graphqlResults = await mockRunGraphQLQuery(event)

        return {
            event,
            graphqlResults: graphqlResults,
            file: args.path.replace(".yml", ""),
            ...typeMaps
        }
    }
}