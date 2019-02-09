const Alexa = require("ask-sdk-core");
const {
  LaunchRequestHandler,
  HelpIntentHandler,
  CancelAndStopIntentHandler,
  SessionEndedRequestHandler,
  FallbackIntentHandler
} = require("./handlers/coreHandlers");
const { NextFixtureIntentHandler } = require("./handlers/customHandlers");
const { ErrorHandler } = require("./handlers/errorHandler");

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
    FallbackIntentHandler,
    NextFixtureIntentHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
