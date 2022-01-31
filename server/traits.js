const { request, gql } = require("graphql-request");

const getTraits = async (headers) => {
    try {
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
  
      return {
        memberId: graphqlData.member.id,
      };
    } catch (err) {
      console.error("Failed to fetch traits", err)
      return {};
    }
  };

module.exports = {
    getTraits
}