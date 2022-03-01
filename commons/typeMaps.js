const customTypes = require("./customTypes");

const getSwiftType = (type) => {
  if (!type) {
    return null;
  }

  const primitives = {
    String: "String",
    Integer: "Int",
    Boolean: "Bool",
    Double: "Double",
    Optional: (s) => `${getSwiftType(s)}?`,
    Array: (s) => `[${getSwiftType(s)}]`,
    Dictionary: (inner) => {
      const types = inner.split(", ");

      const keyType = getSwiftType(types[0]);
      const valueType = getSwiftType(types[1]);

      return `[${keyType}: ${valueType}]`;
    },
  };

  for (customType of customTypes) {
    if (customType.type) {
      primitives[customType.name] = customType.name;
    }
  }

  const splitted = type.split("<");

  const primitive = primitives[splitted.shift().replace(/>/g, "")];

  if (typeof primitive === "function") {
    return primitive(splitted.join("<"));
  }

  return primitive;
};

const getKotlinType = (type) => {
  if (!type) {
    return null;
  }

  const primitives = {
    String: "String",
    Integer: "Int",
    Boolean: "Boolean",
    Double: "Double",
    Optional: (s) => `${getKotlinType(s)}?`,
    Array: (s) => `List<${getKotlinType(s)}>`,
    Dictionary: (inner) => {
      const types = inner.split(", ");

      const keyType = getKotlinType(types[0]);
      const valueType = getKotlinType(types[1]);

      return `Map<${keyType}, ${valueType}>`;
    },
  };

  for (customType of customTypes) {
    if (customType.type) {
      primitives[customType.name] = customType.name;
    }
  }

  const splitted = type.split("<");

  const primitive = primitives[splitted.shift().replace(/>/g, "")];

  if (typeof primitive === "function") {
    return primitive(splitted.join("<"));
  }

  return primitive;
};

const getJSType = (type) => {
  if (!type) {
    return null;
  }

  const primitives = {
    String: "string",
    Integer: "number",
    Boolean: "boolean",
    Double: "number",
    Optional: (s) => `${getJSType(s)} | null`,
    Array: (s) => `${getJSType(s)}[]`,
    Dictionary: (inner) => {
      const types = inner.split(", ");

      const keyType = getJSType(types[0]);
      const valueType = getJSType(types[1]);

      return `{ [name: ${keyType}]: ${valueType} }`;
    },
  };

  for (customType of customTypes) {
    if (customType.type) {
      primitives[customType.name] = customType.name;
    }
  }

  const splitted = type.split("<");

  const primitive = primitives[splitted.shift().replace(/>/g, "")];

  if (typeof primitive === "function") {
    return primitive(splitted.join("<"));
  }

  return primitive;
};

const getBigQuerySchemaType = (type, ignoreCustom = false) => {
  if (!type) {
    return null;
  }

  const primitives = {
    String: {
      type: "STRING",
      mode: "REQUIRED",
    },
    Integer: {
      type: "INTEGER",
      mode: "REQUIRED",
    },
    Boolean: {
      type: "BOOLEAN",
      mode: "REQUIRED",
    },
    Double: {
      type: "INTEGER",
      mode: "REQUIRED",
    },
    Date: {
      type: "TIMESTAMP",
      mode: "REQUIRED",
    },
    Optional: (inner) => {
      const resolvedInner = getBigQuerySchemaType(inner);

      return {
        ...resolvedInner,
        mode: "NULLABLE",
      };
    },
    Array: (inner) => {
      const resolvedInner = getBigQuerySchemaType(inner);

      return {
        ...resolvedInner,
        mode: "REPEATED",
      };
    },
    Dictionary: (inner) => {
      const types = inner.split(", ");

      const keyType = getBigQuerySchemaType(types[0]);
      const valueType = getBigQuerySchemaType(types[1]);

      return {
        type: "STRUCT",
        mode: "REPEATED",
        fields: [
          {
            ...keyType,
            name: "key",
          },
          {
            ...valueType,
            name: "value",
          },
        ],
      };
    },
  };

  if (!ignoreCustom) {
    for (customType of customTypes) {
      if (customType.type === "Enum") {
        const rawType = getBigQuerySchemaType(customType.rawType, true);

        primitives[customType.name] = {
          ...rawType,
          permittedValues: Object.keys(customType.cases).map(
            (key) => customType.cases[key]
          ),
        };
      }
    }
  }

  const splitted = type.split("<");

  const primitive = primitives[splitted.shift().replaceAll(">", "")];

  if (typeof primitive === "function") {
    return primitive(splitted.join("<"));
  }

  return primitive;
};

const getJSToHAnalyticsType = (value) => {
  const type = typeof value;

  const typeMap = {
    string: "String",
    number: "Double",
    boolean: "Boolean",
    array: "Array",
  };

  if (Array.isArray(value)) {
    return `${typeMap.array}<${getJSToHAnalyticsType(value[0])}>`;
  }

  return typeMap[type];
};

module.exports = {
  swiftTypeMap: getSwiftType,
  kotlinTypeMap: getKotlinType,
  jsTypeMap: getJSType,
  bigQuerySchemaTypeMap: getBigQuerySchemaType,
  jsHAnalyticsTypeMap: getJSToHAnalyticsType,
};
