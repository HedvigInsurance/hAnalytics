const yaml = require('js-yaml');
const fs   = require('fs');

const basename = __dirname + '/../../../'

module.exports = {
    params: () => {
        return {
            events: yaml.load(fs.readFileSync(basename + 'analytics-events.yml', 'utf8')).events.map(importPath => 
                yaml.load(fs.readFileSync(basename + importPath, 'utf8'))
            )
        }
    }
}