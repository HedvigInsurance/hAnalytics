const { Strategy } = require("unleash-client");

class MemberIdsStrategy extends Strategy {
    constructor() {
        super("MemberIds");
    }

    isEnabled(parameters, context) {
        return parameters.memberIds.includes(context.memberId);
    }
}

module.exports = {
    appName: 'hanalytics',
    url: process.env.UNLEASH_API_URL,
    customHeaders: {
      Authorization: process.env.UNLEASH_API_KEY,
    },
    environment: process.env.UNLEASH_API_KEY.replace("*:").split(".")[0],
    strategies: [new MemberIdsStrategy()],
}