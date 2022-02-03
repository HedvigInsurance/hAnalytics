const transformHeaders = (headers) => {
  const authorizationHeader = (headers["authorization"] || "").replace(
    "Bearer "
  );

  return {
    Authorization: `Bearer ${authorizationHeader}`,
  };
};

module.exports = {
  transformHeaders,
};
