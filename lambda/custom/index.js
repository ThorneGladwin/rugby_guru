const Alexa = require("ask-sdk-core");
const { LaunchRequestHandler, HelpIntentHandler, CancelAndStopIntentHandler, SessionEndedRequestHandler } = require("./handlers/coreHandlers");
const { ErrorHandler } = require("./handlers/errorHandlers");

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(LaunchRequestHandler, HelloWorldIntentHandler, HelpIntentHandler, CancelAndStopIntentHandler, SessionEndedRequestHandler)
  .addErrorHandlers(ErrorHandler)
  .lambda();
