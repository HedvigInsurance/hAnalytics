const { bigQuerySchemaTypeMap } = require("../../../commons/typeMaps");

const eventFields = [
  {
    name: "event",
    ...bigQuerySchemaTypeMap("String"),
  },
  {
    name: "event_id",
    ...bigQuerySchemaTypeMap("String"),
  },
];

const contextFields = [
  {
    name: "context_app_build",
    ...bigQuerySchemaTypeMap("String"),
  },
  {
    name: "context_app_name",
    ...bigQuerySchemaTypeMap("String"),
  },
  {
    name: "context_app_namespace",
    ...bigQuerySchemaTypeMap("String"),
  },
  {
    name: "context_app_version",
    ...bigQuerySchemaTypeMap("String"),
  },
  {
    name: "context_device_id",
    ...bigQuerySchemaTypeMap("Optional<String>"),
  },
  {
    name: "context_device_version",
    ...bigQuerySchemaTypeMap("Optional<String>"),
  },
  {
    name: "context_device_manufacturer",
    ...bigQuerySchemaTypeMap("Optional<String>"),
  },
  {
    name: "context_device_model",
    ...bigQuerySchemaTypeMap("Optional<String>"),
  },
  {
    name: "context_device_type",
    ...bigQuerySchemaTypeMap("Optional<String>"),
  },
  {
    name: "context_device_name",
    ...bigQuerySchemaTypeMap("Optional<String>"),
  },
  {
    name: "context_ip",
    ...bigQuerySchemaTypeMap("String"),
  },
  {
    name: "context_locale",
    ...bigQuerySchemaTypeMap("String"),
  },
  {
    name: "context_os_name",
    ...bigQuerySchemaTypeMap("String"),
  },
  {
    name: "context_os_version",
    ...bigQuerySchemaTypeMap("String"),
  },
  {
    name: "context_screen_height",
    ...bigQuerySchemaTypeMap("Optional<Double>"),
  },
  {
    name: "context_screen_width",
    ...bigQuerySchemaTypeMap("Optional<Double>"),
  },
  {
    name: "context_screen_density",
    ...bigQuerySchemaTypeMap("Optional<Double>"),
  },
  {
    name: "context_session_id",
    ...bigQuerySchemaTypeMap("String"),
  },
  {
    name: "context_timezone",
    ...bigQuerySchemaTypeMap("Optional<String>"),
  },
  {
    name: "context_traits_member_id",
    ...bigQuerySchemaTypeMap("Optional<String>"),
  },
];

const generalFields = [
  {
    name: "timestamp",
    ...bigQuerySchemaTypeMap("Date"),
  },
  {
    name: "tracking_id",
    ...bigQuerySchemaTypeMap("String"),
  },
];

module.exports = {
  eventFields,
  contextFields,
  generalFields,
};
