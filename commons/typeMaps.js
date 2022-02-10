
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

const getBigQuerySchemaType = (type) => {
    const primitives = {
        "String": {
            type: "STRING"
        },
        "Integer": {
            type: "INTEGER"
        },
        "Boolean": {
            type: "BOOLEAN"
        },
        "Double": {
            type: "INTEGER"
        },
        "Optional": (inner) => ({
            type: inner.type,
            mode: "NULLABLE"
        }),
        "Array": (inner) => ({
            type: inner.type,
            mode: "REPEATED"
        }),
        "Dictionary": () => null
    }

    return type.split("<").reverse().reduce(
        (acc, curr) => {
            const currWithoutBrackets = curr?.type ? curr.type : curr.replace(/>/g, "")
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
    kotlinTypeMap: getKotlinType,
    bigQuerySchemaTypeMap: getBigQuerySchemaType
}