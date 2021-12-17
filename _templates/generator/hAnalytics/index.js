const yaml = require('js-yaml');
const fs   = require('fs');

const basename = __dirname + '/../../../'

module.exports = {
    params: () => {
        return {
            events: yaml.load(fs.readFileSync(basename + 'analytics-events.yml', 'utf8')).events.map(importPath => 
                yaml.load(fs.readFileSync(basename + importPath, 'utf8'))
            ),
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
                "Array<String>": "[String]",
                "Array<Integer>": "[Int]",
                "Array<Boolean>": "[Boolean]",
                "Array<Double>": "[Double]",
                "Array<Optional<String>>": "[String?]",
                "Array<Optional<Integer>>": "[Int?]",
                "Array<Optional<Boolean>>": "[Boolean?]",
                "Array<Optional<Double>>": "[Double?]"
            }
        }
    }
}