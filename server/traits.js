const { request, gql } = require("graphql-request");
const jwt_decode = require('jwt-decode');

const getMemberIdFromGraphQL = async (headers) => {
  const query = gql`
    query hAnalyticsTraits {
      member {
        id
      }
    }
  `;

  const graphqlData = await request(
    process.env.GRAPHQL_ENDPOINT,
    query,
    {},
    headers
  );

  return graphqlData.member.id
}

const getTraits = async (headers, allowJWTMemberId = false) => {
    try {
      var memberId = null

      if (allowJWTMemberId) {
        try {
          const sub = jwt_decode(headers["authorization"])?.sub

          if (sub && sub.includes("member_")) {
            memberId = sub.replace("member_", "")
          }
        } catch (err) {
          console.error("Non valid JWT, probably old hedvig.token")
        }
      }

      if (memberId === null) {
        memberId = await getMemberIdFromGraphQL(headers)
      }

      return {
        memberId
      }
    } catch (err) {
      console.error("Failed to fetch traits", err)
      return {};
    }
  };

module.exports = {
    getTraits
}