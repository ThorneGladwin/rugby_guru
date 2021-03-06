const get = require("lodash/get");
const { getTeamSlotValues, getTeamSlot } = require("../../helpers/slotHelperFunctions");
const { getLastResultForTeam } = require("../../helpers/scraperHelperFunctions");
const { constructLastResultResponse } = require("../../helpers/responseHelperFunctions");
const { customIntentsSpeech } = require("../../resources/customIntents");
const { CoreIntentsSpeech } = require("../../resources/coreIntents");

module.exports = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "IntentRequest" && handlerInput.requestEnvelope.request.intent.name === "LastResultIntent";
  },
  handle(handlerInput) {
    return handlerInput.attributesManager.getPersistentAttributes().then(attributes => {
      const favouriteTeam = get(attributes, ["favouriteTeam"]);
      const teamSlot = getTeamSlot(handlerInput);

      if (favouriteTeam && !teamSlot.value) {
        return getLastResultForTeam(favouriteTeam).then(result => {
          return constructLastResultResponse(handlerInput, favouriteTeam, result);
        });
      }

      if (teamSlot.value) {
        const teamSlotValues = getTeamSlotValues(handlerInput);
        if (teamSlotValues.status === "ER_SUCCESS_MATCH") {
          if (teamSlotValues.values.length > 0) {
            if (teamSlotValues.values.length > 1) {
              const values = teamSlotValues.values.map(i => i.value.name);
              const lastOption = values.pop();
              const possibleOptions = values.join(", ") + " and " + lastOption;
              return handlerInput.responseBuilder
                .speak(CoreIntentsSpeech.MatchedMultipleTeams(possibleOptions))
                .reprompt(CoreIntentsSpeech.MatchedMultipleTeams(possibleOptions))
                .addElicitSlotDirective("Teams")
                .getResponse();
            }
            const selectedTeam = teamSlotValues.values[0].value.name;
            return getLastResultForTeam(selectedTeam).then(result => {
              return constructLastResultResponse(handlerInput, selectedTeam, result);
            });
          }
        }
        return handlerInput.responseBuilder
          .speak(customIntentsSpeech.GetTeamSlotMisunderstood)
          .reprompt(customIntentsSpeech.GetTeamSlotMisunderstood)
          .addElicitSlotDirective("Teams")
          .getResponse();
      }

      return handlerInput.responseBuilder
        .speak(customIntentsSpeech.GetTeamSlot)
        .reprompt(customIntentsSpeech.GetTeamSlot)
        .addElicitSlotDirective("Teams")
        .getResponse();
    });
  }
};
