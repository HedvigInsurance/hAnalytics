const yaml = require('js-yaml')
const fs = require('fs')

module.exports = {
    params: ({ args }) => {
        return {
            event: yaml.load(fs.readFileSync(args.path, 'utf8')),
            file: args.path.replace(".yml", "")
        }
    }
}