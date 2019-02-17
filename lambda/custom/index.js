const Alexa = require("ask-sdk-core");
const {
  LaunchRequestHandler,
  HelpIntentHandler,
  CancelAndStopIntentHandler,
  SessionEndedRequestHandler,
  FallbackIntentHandler
} = require("./handlers/core");
const {
  NextFixtureIntentHandler,
  SetFavouriteTeamIntentHandler,
  GetFavouriteTeamIntentHandler,
  LastResultIntentHandler
} = require("./handlers/custom");
const { ErrorHandler } = require("./handlers/error");
const { dynamoDb } = require("./persistenceAdapters/dynamoDb");

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
    FallbackIntentHandler,
    NextFixtureIntentHandler,
    LastResultIntentHandler,
    SetFavouriteTeamIntentHandler,
    GetFavouriteTeamIntentHandler
  )
  .addErrorHandlers(ErrorHandler)
  .withPersistenceAdapter(dynamoDb)
  .lambda();
