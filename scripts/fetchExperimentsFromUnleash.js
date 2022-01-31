const { startUnleash } = require("unleash-client")
const yaml = require('js-yaml');
const camelCase = require('camelcase');
const fs = require("fs")
const unleashConfig = require("../commons/unleashConfig")

const populateExperimentsFolder = async () => {
    const unleash = await startUnleash(unleashConfig);
    
    const definitions = unleash.getFeatureToggleDefinitions()

    definitions.forEach(definition => {
        const defaultFallback = unleash.getVariant(definition.name)

        const mappedObject = {
            name: definition.name,
            description: definition.description ?? "",
            accessor: camelCase(definition.name),
            defaultFallback: {
                name: defaultFallback.name,
                enabled: defaultFallback.enabled
            },
            variants: definition.variants.map(variant => ({
                name: variant.name,
                case: camelCase(variant.name)
            }))
        }

        fs.writeFileSync(`experiments/${camelCase(definition.name)}.yml`, yaml.dump(mappedObject))
    })
}

populateExperimentsFolder()