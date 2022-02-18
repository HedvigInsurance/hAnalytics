const { bigQuerySchemaTypeMap } = require("../../../commons/typeMaps");

const eventFields = [
  {
    name: "event",
    description: "Information about the event",
    type: "STRUCT",
    mode: "REQUIRED",
    fields: [
      {
        name: "name",
        description: "String name of event, for example screen_view_offer",
        ...bigQuerySchemaTypeMap("String"),
      },
      {
        name: "id",
        description: "Unique ID of the event",
        ...bigQuerySchemaTypeMap("String"),
      },
      {
        name: "timestamp",
        description: "Time when event happened",
        ...bigQuerySchemaTypeMap("Date"),
      },
      {
        name: "ingested",
        description: "Time when event was ingested",
        ...bigQuerySchemaTypeMap("Date"),
      },
    ],
  },
];

const contextFields = [
  {
    name: "context",
    description: "Context with device, user, and other info",
    type: "STRUCT",
    mode: "REQUIRED",
    fields: [
      {
        name: "app",
        description: "Information about the app",
        type: "STRUCT",
        mode: "REQUIRED",
        fields: [
          {
            name: "build",
            description: "The build number of the app, for example 8293",
            ...bigQuerySchemaTypeMap("String"),
          },
          {
            name: "name",
            description: "The name of the app, for example Hedvig, Ugglan",
            ...bigQuerySchemaTypeMap("String"),
          },
          {
            name: "namespace",
            description: "The namespace of the app, for example com.hedvig.app",
            ...bigQuerySchemaTypeMap("String"),
          },
          {
            name: "version",
            description: "The version of the app, for example 7.6.0",
            ...bigQuerySchemaTypeMap("String"),
          },
        ],
      },
      {
        name: "device",
        description: "Information about the device",
        type: "STRUCT",
        mode: "REQUIRED",
        fields: [
          {
            name: "id",
            description:
              "Use this primarily to identify a singular user which doesn't have a member id yet",
            ...bigQuerySchemaTypeMap("String"),
          },
          {
            name: "manufacturer",
            description:
              "The manufacturer of the device, for example Samsung or Apple",
            ...bigQuerySchemaTypeMap("Optional<String>"),
          },
          {
            name: "model",
            description: "The model of device, for example iPhone13,3",
            ...bigQuerySchemaTypeMap("Optional<String>"),
          },
          {
            name: "type",
            description: "The type of device, for example ios or android",
            ...bigQuerySchemaTypeMap("Optional<String>"),
          },
          {
            name: "name",
            description: "The name of the device, for example iPhone",
            ...bigQuerySchemaTypeMap("Optional<String>"),
          },
          {
            name: "screen",
            description: "Information about the screen",
            type: "STRUCT",
            mode: "NULLABLE",
            fields: [
              {
                name: "height",
                description: "Height of screen in pixels",
                ...bigQuerySchemaTypeMap("Optional<Double>"),
              },
              {
                name: "width",
                description: "Width of screen in pixels",
                ...bigQuerySchemaTypeMap("Optional<Double>"),
              },
              {
                name: "density",
                description: "Pixel density of screen",
                ...bigQuerySchemaTypeMap("Optional<Double>"),
              },
            ],
          },
          {
            name: "os",
            description: "Information about the os running on the device",
            type: "STRUCT",
            mode: "REQUIRED",
            fields: [
              {
                name: "name",
                description:
                  "OS name for example Android, iOS, iPadOS, MacOS, Windows",
                ...bigQuerySchemaTypeMap("String"),
              },
              {
                name: "version",
                description: "OS version for example 15.0.1 for iOS 15.0.1",
                ...bigQuerySchemaTypeMap("String"),
              },
            ],
          },
        ],
      },
      {
        name: "ip",
        description: "The users IP address",
        ...bigQuerySchemaTypeMap("String"),
      },
      {
        name: "locale",
        description: "The locale that was current, for example en-SE",
        ...bigQuerySchemaTypeMap("String"),
      },
      {
        name: "session",
        description: "Information about the current session",
        mode: "REQUIRED",
        type: "STRUCT",
        fields: [
          {
            name: "id",
            description:
              "An id which is preserved across a session, when application is closed a new id is generated",
            ...bigQuerySchemaTypeMap("String"),
          },
        ],
      },
      {
        name: "timezone",
        description: "Timezone of device",
        ...bigQuerySchemaTypeMap("String"),
      },
      {
        name: "traits",
        description: "Traits about the user",
        type: "STRUCT",
        mode: "REQUIRED",
        fields: [
          {
            name: "member",
            description: "Traits about the member",
            type: "STRUCT",
            mode: "NULLABLE",
            fields: [
              {
                name: "id",
                description: "Member id associated with the event",
                ...bigQuerySchemaTypeMap("String"),
              },
            ],
          },
        ],
      },
    ],
  },
];

module.exports = {
  eventFields,
  contextFields,
};
