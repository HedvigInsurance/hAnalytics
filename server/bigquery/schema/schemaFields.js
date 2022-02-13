const { bigQuerySchemaTypeMap } = require("../../../commons/typeMaps");

const eventFields = [
  {
    name: "event",
    description: "String name of event, for example screen_view_offer",
    ...bigQuerySchemaTypeMap("String"),
  },
  {
    name: "event_id",
    description: "Unique ID of the event",
    ...bigQuerySchemaTypeMap("String"),
  },
];

const contextFields = [
  {
    name: "context_app_build",
    description: "The build number of the app, for example 8293",
    ...bigQuerySchemaTypeMap("String"),
  },
  {
    name: "context_app_name",
    description: "The name of the app, for example Hedvig, Ugglan",
    ...bigQuerySchemaTypeMap("String"),
  },
  {
    name: "context_app_namespace",
    description: "The namespace of the app, for example com.hedvig.app",
    ...bigQuerySchemaTypeMap("String"),
  },
  {
    name: "context_app_version",
    description: "The version of the app, for example 7.6.0",
    ...bigQuerySchemaTypeMap("String"),
  },
  {
    name: "context_device_manufacturer",
    description: "The manufacturer of the device, for example Samsung or Apple",
    ...bigQuerySchemaTypeMap("Optional<String>"),
  },
  {
    name: "context_device_model",
    description: "The model of device, for example iPhone13,3",
    ...bigQuerySchemaTypeMap("Optional<String>"),
  },
  {
    name: "context_device_type",
    description: "The type of device, for example ios or android",
    ...bigQuerySchemaTypeMap("Optional<String>"),
  },
  {
    name: "context_device_name",
    description: "The name of the device, for example iPhone",
    ...bigQuerySchemaTypeMap("Optional<String>"),
  },
  {
    name: "context_ip",
    description: "The users IP address",
    ...bigQuerySchemaTypeMap("String"),
  },
  {
    name: "context_locale",
    description: "The locale that was current, for example en-SE",
    ...bigQuerySchemaTypeMap("String"),
  },
  {
    name: "context_os_name",
    description: "OS name for example Android, iOS, iPadOS, MacOS, Windows",
    ...bigQuerySchemaTypeMap("String"),
  },
  {
    name: "context_os_version",
    description: "OS version for example 15.0.1 for iOS 15.0.1",
    ...bigQuerySchemaTypeMap("String"),
  },
  {
    name: "context_screen_height",
    description: "Height of screen in pixels",
    ...bigQuerySchemaTypeMap("Optional<Double>"),
  },
  {
    name: "context_screen_width",
    description: "Width of screen in pixels",
    ...bigQuerySchemaTypeMap("Optional<Double>"),
  },
  {
    name: "context_screen_density",
    description: "Pixel density of screen",
    ...bigQuerySchemaTypeMap("Optional<Double>"),
  },
  {
    name: "context_session_id",
    description:
      "An id which is preserved across a session, when application is closed a new id is generated",
    ...bigQuerySchemaTypeMap("String"),
  },
  {
    name: "context_timezone",
    description: "Timezone of device",
    ...bigQuerySchemaTypeMap("String"),
  },
  {
    name: "context_traits_member_id",
    description: "Member id associated with the event",
    ...bigQuerySchemaTypeMap("Optional<String>"),
  },
];

const generalFields = [
  {
    name: "timestamp",
    description: "Time when event happened",
    ...bigQuerySchemaTypeMap("Date"),
  },
  {
    name: "tracking_id",
    description:
      "Tracking id, also called DeviceID in some contexes, use this primarily to identify a singular user",
    ...bigQuerySchemaTypeMap("String"),
  },
];

module.exports = {
  eventFields,
  contextFields,
  generalFields,
};
