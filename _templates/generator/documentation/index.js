const yaml = require('js-yaml')
const fs = require('fs')
const typeMaps = require('../../../commons/typeMaps')

module.exports = {
    params: ({ args }) => {
        return {
            event: yaml.load(fs.readFileSync(args.path, 'utf8')),
            file: args.path.replace(".yml", ""),
            ...typeMaps
        }
    }
}