const yaml = require('js-yaml');
const fs = require('fs');
const { format } = require("graphql-formatter")
const { addMocksToSchema } = require("@graphql-tools/mock")
const { introspectSchema } = require('@graphql-tools/wrap')
const { graphql, print } = require('graphql')
const fetch = require('cross-fetch');
const jmespath = require('jmespath');

const basename = __dirname + '/../../../'

const executor = async ({ document, variables }) => {
    const query = print(document)

    const fetchResult = await fetch('https://graphql.dev.hedvigit.com/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query, variables })
    })
    return fetchResult.json()
}

const mockRunGraphQLQuery = async (query, variables) => {
    const schema = await introspectSchema(executor)
    const schemaWithMocks = addMocksToSchema({ schema })

    const result = await graphql(schemaWithMocks, query, null, null, variables)

    return result
}

module.exports = {
    params: async () => {
        const events = await Promise.all(yaml.load(fs.readFileSync(basename + 'analytics-events.yml', 'utf8')).events.map(async importPath => {
            const event = yaml.load(fs.readFileSync(basename + importPath, 'utf8'))

            if (event.graphql) {
                const variables = [
                    event.inputs ?? [],
                    event.constants ?? []
                ]
                    .flatMap(i => i)
                    .filter(input => (event.graphql.variables ?? []).includes(input.name))
                    .reduce((prev, curr) => {
                        switch (curr.type) {
                            case "String":
                                prev[curr.name] = "mock"
                                break
                            case "Optional<String>":
                                prev[curr.name] = "mock"
                                break
                            case "Integer":
                                prev[curr.name] = 20
                                break
                            case "Optional<Integer>":
                                prev[curr.name] = 20
                                break
                            case "Boolean":
                                prev[curr.name] = true
                                break
                            case "Optional<Boolean>":
                                prev[curr.name] = true
                                break
                            case "Double":
                                prev[curr.name] = 2.20
                                break
                            case "Optional<Double>":
                                prev[curr.name] = 2.20
                                break
                            case "Array<String>":
                                prev[curr.name] = ["mock"]
                                break
                            case "Array<Integer>":
                                return prev[curr.name] = [20]
                                break
                            case "Array<Boolean>":
                                prev[curr.name] = [true]
                                break
                            case "Array<Double>":
                                prev[curr.name] = [2.20]
                            case "Array<Optional<String>>":
                                prev[curr.name] = [null, "mock"]
                                break
                            case "Array<Optional<Integer>>":
                                prev[curr.name] = [null, 20]
                                break
                            case "Array<Optional<Boolean>>":
                                prev[curr.name] = [null, true]
                                break
                            case "Array<Optional<Double>>":
                                prev[curr.name] = [null, 2.20]
                                break
                        }

                        return prev
                    }, {})

                const result = await mockRunGraphQLQuery(
                    event.graphql.query,
                    variables ?? {}
                )

                if (result.errors) {
                    console.log(result)
                    throw `Invalid graphql: ${event.graphql.query} in ${basename + importPath}`
                }

                event.graphql.getters.forEach(getter => {
                    console.log(`Result for ${getter.getter}: ${jmespath.search(result.data, getter.getter)}`)
                });
            }

            return event
        }
        ))

        return {
            events: events,
            swiftTypeMap: {
                "String": "String",
                "Integer": "Int",
                "Boolean": "Bool",
                "Double": "Double",
                "Optional<String>": "String?",
                "Optional<Integer>": "Int?",
                "Optional<Boolean>": "Bool?",
                "Optional<Double>": "Double?",
                "Array<String>": "[String]",
                "Array<Integer>": "[Int]",
                "Array<Boolean>": "[Bool]",
                "Array<Double>": "[Double]",
                "Array<Optional<String>>": "[String?]",
                "Array<Optional<Integer>>": "[Int?]",
                "Array<Optional<Boolean>>": "[Bool?]",
                "Array<Optional<Double>>": "[Double?]"
            },
            kotlinTypeMap: {
                "String": "String",
                "Integer": "Int",
                "Boolean": "Boolean",
                "Double": "Double",
                "Optional<String>": "String?",
                "Optional<Integer>": "Int?",
                "Optional<Boolean>": "Boolean?",
                "Optional<Double>": "Double?",
                "Array<String>": "Array<String>",
                "Array<Integer>": "Array<Int>",
                "Array<Boolean>": "Array<Boolean>",
                "Array<Double>": "Array<Double>",
                "Array<Optional<String>>": "Array<String?>",
                "Array<Optional<Integer>>": "Array<Int?>",
                "Array<Optional<Boolean>>": "Array<Boolean?>",
                "Array<Optional<Double>>": "Array<Double?>"
            },
            formatGQL: (string) => format(string)
        }
    }
}