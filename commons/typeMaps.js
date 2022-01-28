
const getSwiftType = (type) => {
    const primitives = {
        "String": "String",
        "Integer": "Int",
        "Boolean": "Bool",
        "Double": "Double",
        "Optional": (s) => `${s}?`,
        "Array": (s) => `[${s}]`,
        "Dictionary": (s) => `[${s.replace(",", ":")}]`
    }

    return type.split("<").reverse().reduce(
        (acc, curr) => {
            const currWithoutBrackets = curr.replaceAll(">", "")
            const primitive = primitives[currWithoutBrackets]

            if (typeof primitive === 'function') {
                return primitive(acc ?? "")
            }

            return primitive ? primitive : currWithoutBrackets
        },
        ""
    );
}

module.exports = {
    swiftTypeMap: getSwiftType,
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
        "Array<Optional<Double>>": "Array<Double?>",
        "Dictionary<String, Any>": "Map<String, Any>"
    },
}