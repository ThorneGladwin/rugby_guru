const get = require("lodash/get");

const isSessionNew = handlerInput => {
  return get(handlerInput, ["requestEnvelope", "session", "new"], false);
};

module.exports = {
  isSessionNew
};
