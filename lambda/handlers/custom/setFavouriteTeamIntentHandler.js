const { getTeamSlotValues } = require("../../helpers/slotHelperFunctions");
const { isSessionNew } = require("../../helpers/requestHelperFunctions");
const { SetFavouriteTeamIntentSpeech, customIntentsSpeech } = require("../../resources/customIntents");
const { CoreIntentsSpeech } = require("../../resources/coreIntents");
const { ErrorsSpeech } = require("../../resources/errorIntent");

module.exports = {
    canHandle(handlerInput) {
      return (
        handlerInput.requestEnvelope.request.type === "IntentRequest" && handlerInput.requestEnvelope.request.intent.name === "SetFavouriteTeamIntent"
      );
    },
    handle(handlerInput) {
      const teamSlot = getTeamSlotValues(handlerInput);
  
      if (teamSlot.status === "ER_SUCCESS_MATCH") {
        if (teamSlot.values.length > 0) {
          if (teamSlot.values.length > 1) {
            const values = teamSlot.values.map(i => i.value.name);
            const lastOption = values.pop();
            const possibleOptions = values.join(", ") + " and " + lastOption;
            return handlerInput.responseBuilder
              .speak(CoreIntentsSpeech.MatchedMultipleTeams(possibleOptions))
              .reprompt(CoreIntentsSpeech.MatchedMultipleTeams(possibleOptions))
              .addElicitSlotDirective("Teams")
              .getResponse();
          }
          const favouriteTeam = teamSlot.values[0].value.name;
          return handlerInput.attributesManager
            .getPersistentAttributes()
            .then(attributes => {
              const newAttributes = {
                ...attributes,
                favouriteTeam
              };
              handlerInput.attributesManager.setPersistentAttributes(newAttributes);
  
              return handlerInput.attributesManager.savePersistentAttributes();
            })
            .then(() => {
              return isSessionNew(handlerInput)
                ? handlerInput.responseBuilder
                    .speak(SetFavouriteTeamIntentSpeech.FavouriteTeamSelected(favouriteTeam))
                    .withShouldEndSession(true)
                    .getResponse()
                : handlerInput.responseBuilder
                    .speak(SetFavouriteTeamIntentSpeech.FavouriteTeamSelected(favouriteTeam).concat(` ${CoreIntentsSpeech.AnyMoreHelp}`))
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
      }
      return handlerInput.responseBuilder
        .speak(customIntentsSpeech.GetTeamSlotMisunderstood)
        .reprompt(customIntentsSpeech.GetTeamSlotMisunderstood)
        .addElicitSlotDirective("Teams")
        .getResponse();
    }
  };