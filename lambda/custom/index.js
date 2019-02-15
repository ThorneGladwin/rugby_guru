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
const { dynamoDb } = require("./persistenceAdapters/dynamoDb");

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
  .withPersistenceAdapter(dynamoDb)
  .lambda();
