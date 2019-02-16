const get = require("lodash/get");

const getTeamSlotValues = handlerInput => {
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

const getTeamSlot = handlerInoput => {
  return get(handlerInoput, ["requestEnvelope", "request", "intent", "slots", "Teams"]);
};

module.exports = {
  getTeamSlotValues,
  getTeamSlot
};
