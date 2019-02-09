const get = require("lodash/get");

const getTeamSlot = handlerInput => {
  const resolutions = get(handlerInput, ["requestEnvelope", "request", "intent", "slots", "Teams", "resolutions", "resolutionsPerAuthority"], []);

  if (resolutions.length > 0) {
    const statusCode = get(resolutions[0], ["status", "code"]);
    const values = get(resolutions[0], ["values"], []);
    return {
      status: statusCode,
      values
    };
  }
  return {
    status: "ER_SUCCESS_NO_MATCH",
    values: []
  };
};

module.exports = {
  getTeamSlot
};
