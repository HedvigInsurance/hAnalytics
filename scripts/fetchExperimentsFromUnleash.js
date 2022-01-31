const { startUnleash } = require("unleash-client")
const yaml = require('js-yaml');
const camelCase = require('camelcase');
const fs = require("fs")

const populateExperimentsFolder = async () => {
    const unleash = await startUnleash({
        appName: 'hanalytics',
        url: process.env.UNLEASH_API_URL,
        customHeaders: {
          Authorization: process.env.UNLEASH_API_KEY,
        },
    });
    
    const definitions = unleash.getFeatureToggleDefinitions()

    definitions.forEach(definition => {
        const mappedObject = {
            name: definition.name,
            description: definition.description ?? "",
            accessor: camelCase(definition.name),
            variants: definition.variants.map(variant => ({
                name: variant.name,
                case: camelCase(variant.name)
            }))
        }

        fs.writeFileSync(`experiments/${camelCase(definition.name)}.yml`, yaml.dump(mappedObject))
    })
}

populateExperimentsFolder()