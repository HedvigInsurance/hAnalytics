
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
            const currWithoutBrackets = curr.replace(/>/g, "")
            const primitive = primitives[currWithoutBrackets]

            if (typeof primitive === 'function') {
                return primitive(acc ?? "")
            }

            return primitive ? primitive : currWithoutBrackets
        },
        ""
    );
}

const getKotlinType = (type) => {
    const primitives = {
        "String": "String",
        "Integer": "Int",
        "Boolean": "Boolean",
        "Double": "Double",
        "Optional": (s) => `${s}?`,
        "Array": (s) => `Array<${s}>`,
        "Dictionary": (s) => `Map<${s}>`
    }

    return type.split("<").reverse().reduce(
        (acc, curr) => {
            const currWithoutBrackets = curr.replace(/>/g, "")
            const primitive = primitives[currWithoutBrackets]

            if (typeof primitive === 'function') {
                return primitive(acc ?? "")
            }

            return primitive ? primitive : currWithoutBrackets
        },
        ""
    );
}

const getPrimitiveType = (type) => {
    const primitives = {
        "string": "String",
        "number": "Double",
        "boolean": "Bool"
    }

    return primitives[type]
}

module.exports = {
    swiftTypeMap: getSwiftType,
    kotlinTypeMap: getKotlinType,
    primitiveTypeMap: getPrimitiveType
}