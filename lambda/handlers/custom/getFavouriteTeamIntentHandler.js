const get = require("lodash/get");
const { isSessionNew } = require("../../helpers/requestHelperFunctions");
const { GetFavouriteTeamIntentSpeech } = require("../../resources/customIntents");
const { CoreIntentsSpeech } = require("../../resources/coreIntents");
const { ErrorsSpeech } = require("../../resources/errorIntent");

module.exports = {
    canHandle(handlerInput) {
      return (
        handlerInput.requestEnvelope.request.type === "IntentRequest" && handlerInput.requestEnvelope.request.intent.name === "GetFavouriteTeamIntent"
      );
    },
    handle(handlerInput) {
      return handlerInput.attributesManager
        .getPersistentAttributes()
        .then(attributes => {
          const favouriteTeam = get(attributes, ["favouriteTeam"]);
          if (favouriteTeam) {
            return isSessionNew(handlerInput)
              ? handlerInput.responseBuilder
                  .speak(GetFavouriteTeamIntentSpeech.SayFavouriteTeam(favouriteTeam))
                  .withShouldEndSession(true)
                  .getResponse()
              : handlerInput.responseBuilder
                  .speak(GetFavouriteTeamIntentSpeech.SayFavouriteTeam(favouriteTeam).concat(` ${CoreIntentsSpeech.AnyMoreHelp}`))
                  .reprompt(CoreIntentsSpeech.AnyMoreHelp)
                  .getResponse();
          }
          return isSessionNew(handlerInput)
            ? handlerInput.responseBuilder
                .speak(GetFavouriteTeamIntentSpeech.NoFavouriteTeam)
                .withShouldEndSession(true)
                .getResponse()
            : handlerInput.responseBuilder
                .speak(GetFavouriteTeamIntentSpeech.NoFavouriteTeam.concat(` ${CoreIntentsSpeech.AnyMoreHelp}`))
                .reprompt(CoreIntentsSpeech.AnyMoreHelp)
                .getResponse();
        })
        .catch(error => {
          console.error(error);
          return handlerInput.responseBuilder
            .speak(ErrorsSpeech.GenericError)
            .withShouldEndSession(true)
            .getResponse();
        });
    }
  };