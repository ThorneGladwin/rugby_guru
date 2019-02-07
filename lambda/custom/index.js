const Alexa = require("ask-sdk-core");
const {
  LaunchRequestHandler,
  HelpIntentHandler,
  CancelAndStopIntentHandler,
  SessionEndedRequestHandler,
  FallbackIntentHandler
} = require("./handlers/core/coreHandlers");
const { ErrorHandler } = require("./handlers/core/errorHandlers");

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(LaunchRequestHandler, HelpIntentHandler, CancelAndStopIntentHandler, SessionEndedRequestHandler, FallbackIntentHandler)
  .addErrorHandlers(ErrorHandler)
  .lambda();
