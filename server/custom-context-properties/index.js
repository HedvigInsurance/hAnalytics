const fetch = require("cross-fetch");
const getContractTypesFromProductPricing = async (headers) => {
  const contractsResponse = await fetch(
    process.env.API_GATEWAY_ENDPOINT + "/productPricing/contracts",
    {
      method: "GET",
      headers,
    }
  );
  const contractsJson = await contractsResponse.json();
  return contractsJson.map((c) => c.typeOfContract);
};

const NON_PAYING_CONTRACT_TYPES = [
  "SE_QASA_SHORT_TERM_RENTAL",
  "SE_QASA_LONG_TERM_RENTAL",
];

const isNonPayingMember = async (headers) => {
  try {
    const contractTypes = await getContractTypesFromProductPricing(headers);

    return !contractTypes.some(
      (type) => !NON_PAYING_CONTRACT_TYPES.includes(type)
    );
  } catch (err) {
    console.error(
      "Failed to fetch isNonPayingMember, defaulting to false",
      err
    );
    return false;
  }
};

const getCustomContextProperties = async (headers) => {
  return {
    is_non_paying_member: String(await isNonPayingMember(headers)),
  };
};

module.exports = {
  getCustomContextProperties,
};
