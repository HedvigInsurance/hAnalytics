const getSwiftType = (type) => {
  if (!type) {
    return null;
  }

  const primitives = {
    String: "String",
    Integer: "Int",
    Boolean: "Bool",
    Double: "Double",
    Optional: (s) => `${s}?`,
    Array: (s) => `[${s}]`,
    Dictionary: (s) => `[${s.replace(",", ":")}]`,
  };

  return type
    .split("<")
    .reverse()
    .reduce((acc, curr) => {
      const currWithoutBrackets = curr.replace(/>/g, "");
      const primitive = primitives[currWithoutBrackets];

      if (typeof primitive === "function") {
        return primitive(acc ?? "");
      }

      return primitive ? primitive : currWithoutBrackets;
    }, "");
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
    Optional: (s) => `${s}?`,
    Array: (s) => `List<${s}>`,
    Dictionary: (s) => `Map<${s}>`,
  };

  return type
    .split("<")
    .reverse()
    .reduce((acc, curr) => {
      const currWithoutBrackets = curr.replace(/>/g, "");
      const primitive = primitives[currWithoutBrackets];

      if (typeof primitive === "function") {
        return primitive(acc ?? "");
      }

      return primitive ? primitive : currWithoutBrackets;
    }, "");
};

const getBigQuerySchemaType = (type) => {
  if (!type) {
    return null;
  }
  const primitives = {
    String: {
      type: "STRING",
    },
    Integer: {
      type: "INTEGER",
    },
    Boolean: {
      type: "BOOLEAN",
    },
    Double: {
      type: "INTEGER",
    },
    Optional: (inner) => ({
      type: inner.type,
      mode: "NULLABLE",
    }),
    Array: (inner) => ({
      type: inner.type,
      mode: "REPEATED",
    }),
    Dictionary: () => null,
  };

  return type
    .split("<")
    .reverse()
    .reduce((acc, curr) => {
      const currWithoutBrackets = curr?.type
        ? curr.type
        : curr.replace(/>/g, "");
      const primitive = primitives[currWithoutBrackets];

      if (typeof primitive === "function") {
        return primitive(acc ?? "");
      }

      return primitive ? primitive : currWithoutBrackets;
    }, "");
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
  bigQuerySchemaTypeMap: getBigQuerySchemaType,
  jsTypeMap: getJSToHAnalyticsType,
};
