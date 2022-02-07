const { startUnleash } = require("unleash-client")
const yaml = require('js-yaml');
const camelCase = require('camelcase');
const fs = require("fs")
const unleashConfig = require("../commons/unleashConfig")

const populateExperimentsFolder = async () => {
    const unleash = await startUnleash(unleashConfig);
    
    const definitions = unleash.getFeatureToggleDefinitions()

    const DIR = "experiments"

    fs.rmSync(DIR, { recursive: true })
    fs.mkdirSync(DIR)

    definitions.forEach(definition => {
        const defaultFallback = unleash.getVariant(definition.name)
        const defaultIsEnabled = unleash.isEnabled(definition.name)

        const codegenStrategy = definition.strategies.find(strategy => 
            strategy.name === 'Codegen'
        )

        if (!codegenStrategy) {
            console.log(`Skipping ${definition.name} as no Codegen strategy was defined`)
            return
        }

        const hasVariants = definition.variants.length > 0

        const getDefaultFallback = () => {
            if (hasVariants) {
                return camelCase(defaultFallback.name)
            }

            return defaultIsEnabled ? "enabled" : "disabled"
        }

        const mappedObject = {
            name: definition.name,
            description: definition.description ?? "",
            accessor: camelCase(definition.name),
            defaultFallback: getDefaultFallback(),
            variants: definition.variants.map(variant => ({
                name: variant.name,
                case: camelCase(variant.name)
            })),
            targets: [
                "Swift", "Kotlin"
            ].filter(target => codegenStrategy.parameters[target] === 'true')
        }

        fs.writeFileSync(`${DIR}/${camelCase(definition.name)}.yml`, yaml.dump(mappedObject))
    })
}

populateExperimentsFolder()