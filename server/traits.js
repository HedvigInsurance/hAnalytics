const jwt_decode = require("jwt-decode");
const fetch = require("cross-fetch");

const getMemberIdFromMemberService = async (headers) => {
  const memberResponse = await fetch(
    process.env.API_GATEWAY_ENDPOINT + "/member/me",
    {
      method: "GET",
      headers,
    }
  ).then((res) => res.json());

  return memberResponse.memberId;
};

const getTraits = async (headers, allowJWTMemberId = false) => {
  try {
    var memberId = null;

    if (allowJWTMemberId) {
      try {
        const sub = jwt_decode(
          headers["authorization"].replace("Bearer ", "")
        )?.sub;

        if (sub && sub.includes("member_")) {
          memberId = sub.replace("member_", "");
        }
      } catch (err) {
        console.error("Non valid JWT, probably old hedvig.token");
      }
    }

    if (memberId === null) {
      memberId = await getMemberIdFromMemberService(headers);
    }

    if (!memberId) {
      return {
        member: null,
      };
    }

    return {
      member: {
        id: memberId,
      },
    };
  } catch (err) {
    console.error("Failed to fetch traits", err);
    return {
      member: null,
    };
  }
};

module.exports = {
  getTraits,
};
