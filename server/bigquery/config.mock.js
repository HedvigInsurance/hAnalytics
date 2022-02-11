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
          var table = tables.find((table) => table.name == name);

          if (!table) {
            throw new Error("Table not found");
          }

          table.config = config;

          tables = [
            ...tables.filter((table) => table.name != name),
            ...[table],
          ];
        },
        insert: async (rows) => {
          var table = tables.find((table) => table.name == name);

          if (!table) {
            throw new Error("Table not found");
          }

          table.rows = [...table.rows, ...rows];

          tables = [...tables.filter((table) => table.name != name), table];
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
