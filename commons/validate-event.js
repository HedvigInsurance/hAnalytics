const yaml = require('js-yaml')
const fs = require('fs')
const jmespath = require('jmespath')

module.exports = (path, data) => {
    const event = yaml.load(fs.readFileSync(path.replace(".test.js", ".yml"), 'utf8'))

    const variables = event.graphql.selectors.reduce((acc, selector) => {
        acc[selector.name] = jmespath.search(data, selector.path)
        return acc
    }, {})

    return {
        name: event.name,
        variables: variables
    }
}