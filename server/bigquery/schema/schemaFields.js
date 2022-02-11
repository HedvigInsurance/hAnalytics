const eventFields = [
  {
    name: "event",
    type: "STRING",
  },
  {
    name: "event_id",
    type: "STRING",
  },
];

const contextFields = [
  {
    name: "context_app_build",
    type: "STRING",
    mode: "NULLABLE",
  },
  {
    name: "context_app_name",
    type: "STRING",
    mode: "NULLABLE",
  },
  {
    name: "context_app_namespace",
    type: "STRING",
    mode: "NULLABLE",
  },
  {
    name: "context_app_version",
    type: "STRING",
    mode: "NULLABLE",
  },
  {
    name: "context_device_id",
    type: "STRING",
    mode: "NULLABLE",
  },
  {
    name: "context_device_version",
    type: "STRING",
    mode: "NULLABLE",
  },
  {
    name: "context_device_manufacturer",
    type: "STRING",
    mode: "NULLABLE",
  },
  {
    name: "context_device_model",
    type: "STRING",
    mode: "NULLABLE",
  },
  {
    name: "context_device_type",
    type: "STRING",
    mode: "NULLABLE",
  },
  {
    name: "context_device_name",
    type: "STRING",
    mode: "NULLABLE",
  },
  {
    name: "context_ip",
    type: "STRING",
    mode: "NULLABLE",
  },
  {
    name: "context_locale",
    type: "STRING",
    mode: "NULLABLE",
  },
  {
    name: "context_os_name",
    type: "STRING",
    mode: "NULLABLE",
  },
  {
    name: "context_os_version",
    type: "STRING",
    mode: "NULLABLE",
  },
  {
    name: "context_screen_height",
    type: "INTEGER",
    mode: "NULLABLE",
  },
  {
    name: "context_screen_width",
    type: "INTEGER",
    mode: "NULLABLE",
  },
  {
    name: "context_screen_density",
    type: "INTEGER",
    mode: "NULLABLE",
  },
  {
    name: "context_session_id",
    type: "STRING",
    mode: "NULLABLE",
  },
  {
    name: "context_timezone",
    type: "STRING",
    mode: "NULLABLE",
  },
  {
    name: "context_traits_member_id",
    type: "STRING",
    mode: "NULLABLE",
  },
];

const generalFields = [
  {
    name: "timestamp",
    type: "TIMESTAMP",
  },
  {
    name: "tracking_id",
    type: "STRING",
  },
];

module.exports = {
  eventFields,
  contextFields,
  generalFields,
};
