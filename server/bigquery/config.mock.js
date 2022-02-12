module.exports = () => {
  var tables = [];

  var bigquery = {
    getTables: () => tables,
    dataset: () => ({
      createTable: async (name, config) => {
        if (tables.find((table) => table.name == name)) {
          throw new Error("Table exists");
        }

        tables.push({
          name,
          config,
          rows: [],
        });
      },
      table: (name) => ({
        getMetadata: async () => {
          var table = tables.find((table) => table.name == name);

          if (!table) {
            throw new Error("Table not found");
          }

          return [table.config];
        },
        setMetadata: async (config) => {
          var tableIndex = tables.findIndex((table) => table.name == name);

          if (!tables[tableIndex]) {
            throw new Error("Table not found");
          }

          tables[tableIndex].config = config;
        },
        insert: async (rows) => {
          var tableIndex = tables.findIndex((table) => table.name == name);

          if (!tables[tableIndex]) {
            throw new Error("Table not found");
          }

          rows.forEach((row) => {
            tables[tableIndex].rows.push(row);
          });
        },
        get: async () => {
          var table = tables.find((table) => table.name == name);

          if (!table) {
            throw new Error("Table not found");
          }

          return [
            {
              ...table,
              ...bigquery.dataset().table(name),
            },
          ];
        },
      }),
    }),
  };

  return {
    dataset: "mock_dataset",
    bigquery: bigquery,
    projectId: "mock_project_id",
  };
};
