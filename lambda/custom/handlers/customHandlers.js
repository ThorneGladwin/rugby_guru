const get = require("lodash/get");
const { getTeamSlotValues, getTeamSlot } = require("../helpers/slotHelperFunctions");
const { getNextFixtureForTeam, getLastResultForTeam } = require("../helpers/scraperHelperFunctions");
const { constructNextFixtureResponse, constructLastResultResponse } = require("../helpers/responseHelperFunctions");
const { isSessionNew } = require("../helpers/requestHelperFunctions");
const { SetFavouriteTeamIntentSpeech, GetFavouriteTeamIntentSpeech, customIntentsSpeech } = require("../resources/customIntents");
const { CoreIntentsSpeech } = require("../resources/coreIntents");
const { ErrorsSpeech } = require("../resources/errorIntent");

const NextFixtureIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "IntentRequest" && handlerInput.requestEnvelope.request.intent.name === "NextFixtureIntent";
  },
  handle(handlerInput) {
    return handlerInput.attributesManager.getPersistentAttributes().then(attributes => {
      const favouriteTeam = get(attributes, ["favouriteTeam"]);
      const teamSlot = getTeamSlot(handlerInput);

      if (favouriteTeam && !teamSlot.value) {
        return getNextFixtureForTeam(favouriteTeam).then(result => {
          return constructNextFixtureResponse(handlerInput, favouriteTeam, result);
        });
      }

      if (teamSlot.value) {
        const teamSlotValues = getTeamSlotValues(handlerInput);
        if (teamSlotValues.status === "ER_SUCCESS_MATCH") {
          if (teamSlotValues.values.length > 0) {
            if (teamSlotValues.values.length > 1) {
              const values = teamSlotValues.values.map(i => i.value.name);
              const lastOption = values.pop();
              const possibleOptions = values.join(", ") + " and" + lastOption;
              return handlerInput.responseBuilder
                .speak(CoreIntentsSpeech.MatchedMultipleTeams(possibleOptions))
                .reprompt(CoreIntentsSpeech.MatchedMultipleTeams(possibleOptions))
                .addElicitSlotDirective("Teams")
                .getResponse();
            }
            const selectedTeam = teamSlotValues.values[0].value.name;
            return getNextFixtureForTeam(selectedTeam).then(result => {
              return constructNextFixtureResponse(handlerInput, selectedTeam, result);
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

const SetFavouriteTeamIntentHandler = {
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
          const possibleOptions = values.join(", ") + " and" + lastOption;
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

const GetFavouriteTeamIntentHandler = {
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

const LastResultIntentHandler = {
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
              const possibleOptions = values.join(", ") + " and" + lastOption;
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

module.exports = {
  NextFixtureIntentHandler,
  SetFavouriteTeamIntentHandler,
  GetFavouriteTeamIntentHandler,
  LastResultIntentHandler
};
