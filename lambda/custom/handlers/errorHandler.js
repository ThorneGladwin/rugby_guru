const { Errors } = require("../resources/errorIntent");

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak(Errors.GenericError)
      .withShouldEndSession(true)
      .getResponse();
  }
};

module.exports = {
  ErrorHandler
};
