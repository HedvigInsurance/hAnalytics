const yaml = require('js-yaml')
const fs = require('fs')
const typeMaps = require('../../../commons/typeMaps')
const mockRunGraphQLQuery = require('../../../commons/mockRunGraphqlEvent')
const { Octokit } = require("@octokit/core")

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
})

const getIntegrationStatus = async (event) => {
    const today = new Date();
    const lastUpdated = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

    try {
        const iosResult = await octokit.request('GET /search/code', {
            q: `${event.accessor}( in:file repo:HedvigInsurance/Ugglan`
        })

        const androidResult = await octokit.request('GET /search/code', {
            q: `${event.accessor}( in:file repo:HedvigInsurance/Android`
        })

        return {
            ios: iosResult.total_count > 0,
            android: androidResult.total_count > 0,
            lastUpdated: lastUpdated
        }
    } catch (err) {
        return {
            ios: false,
            android: false,
            lastUpdated: lastUpdated
        }
    }
}

module.exports = {
    params: async ({ args }) => {
        const event = yaml.load(fs.readFileSync(args.path, 'utf8'))

        const graphqlResults = await mockRunGraphQLQuery(event)

        return {
            event,
            graphqlResults: graphqlResults,
            file: args.path.replace(".yml", ""),
            integrationStatus: await getIntegrationStatus(event),
            ...typeMaps
        }
    }
}