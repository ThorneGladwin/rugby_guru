const Alexa = require("ask-sdk-core");
const { LaunchRequestHandler, HelpIntentHandler, CancelAndStopIntentHandler, SessionEndedRequestHandler } = require("./handlers/coreHandlers");
const { ErrorHandler } = require("./handlers/errorHandlers");

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(LaunchRequestHandler, HelpIntentHandler, CancelAndStopIntentHandler, SessionEndedRequestHandler)
  .addErrorHandlers(ErrorHandler)
  .lambda();
