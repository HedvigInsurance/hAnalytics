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

const getBigQuerySchemaType = (type, base = {}) => {
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
    Optional: (inner) => ({
      ...getBigQuerySchemaType(inner, base),
      mode: "NULLABLE",
    }),
    Array: (inner) => ({
      ...getBigQuerySchemaType(inner, base),
      mode: "REPEATED",
    }),
    Dictionary: (inner) =>
      Object.keys(base).map((key) => {
        return {
          name: key,
          ...getBigQuerySchemaType(inner.split(", ")[1], base[key]),
          mode: "NULLABLE",
        };
      }),
    Any: {
      ...getBigQuerySchemaType(getJSToHAnalyticsType(base)),
      mode: "REQUIRED",
    },
  };

  const splitted = type.split("<");

  const primitive = primitives[splitted.shift().replaceAll(">", "")];

  if (typeof primitive === "function") {
    return primitive(splitted.join("<"), base);
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
  bigQuerySchemaTypeMap: getBigQuerySchemaType,
  jsTypeMap: getJSToHAnalyticsType,
};
