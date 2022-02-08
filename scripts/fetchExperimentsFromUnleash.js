const { startUnleash } = require("unleash-client")
const yaml = require('js-yaml');
const camelCase = require('camelcase');
const fs = require("fs")
const unleashConfig = require("../commons/unleashConfig")
const typeMaps = require("../commons/typeMaps")

const getAssociatedValues = (variant, replaceValues) => {
    if (variant.payload?.type == 'json') {
        const parsedJSON = JSON.parse(variant.payload.value)
        const keys = Object.keys(parsedJSON)

        return keys.reduce((obj, key) => {
            const type = typeMaps.primitiveTypeMap(typeof parsedJSON[key])

            if (type) {
                if (replaceValues) {
                    obj[camelCase(key)] = {
                        name: key,
                        type: type
                    }
                } else {
                    obj[camelCase(key)] = {
                        name: key,
                        type: type,
                        value: parsedJSON[key]
                    }
                }
            }
            
            return obj
        }, {})
    }

    return null
}

const populateExperimentsFolder = async () => {
    const unleash = await startUnleash(unleashConfig);
    
    const definitions = unleash.getFeatureToggleDefinitions()

    const DIR = "experiments"

    fs.rmSync(DIR, { recursive: true })
    fs.mkdirSync(DIR)

    definitions.forEach(definition => {
        const defaultFallback = unleash.getVariant(definition.name, {
            environment: "default"
        })
        const defaultIsEnabled = unleash.isEnabled(definition.name, {
            environment: "default"
        })

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
                return {
                    name: camelCase(defaultFallback.name),
                    case: camelCase(defaultFallback.name),
                    associatedValues: getAssociatedValues(defaultFallback, false)
                }
            }

            return {
                name: defaultIsEnabled ? "enabled" : "disabled"
            }
        }

        if (hasVariants) {
            // make sure variants contain fallback
            if (!definition.variants.find(variant => variant.name == defaultFallback.name)) {
                console.log(`Fallback resolved to ${defaultFallback.name} but no variant with that name existed, check your setup.`)
                return
            }
        }

        const mappedObject = {
            name: definition.name,
            description: definition.description ?? "",
            accessor: camelCase(definition.name),
            defaultFallback: getDefaultFallback(),
            variants: definition.variants.map(variant => ({
                name: variant.name,
                case: camelCase(variant.name),
                associatedValues: getAssociatedValues(variant, true)
            })),
            targets: [
                "Swift", "Kotlin"
            ].filter(target => codegenStrategy.parameters[target] === 'true')
        }

        fs.writeFileSync(`${DIR}/${camelCase(definition.name)}.yml`, yaml.dump(mappedObject))
    })
}

populateExperimentsFolder()