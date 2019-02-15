const get = require("lodash/get");
const { getTeamSlot } = require("../helpers/slotHelperFunctions");
const { SetFavouriteTeamIntentSpeech, GetFavouriteTeamIntentSpeech } = require("../resources/customIntents");
const { ErrorsSpeech } = require("../resources/errorIntent");

const NextFixtureIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "IntentRequest" && handlerInput.requestEnvelope.request.intent.name === "NextFixtureIntent";
  },
  handle(handlerInput) {
    const teamSlot = getTeamSlot(handlerInput);
    if (teamSlot.status === "ER_SUCCESS_MATCH") {
      if (teamSlot.values.length > 0) {
        if (teamSlot.values.length > 1) {
          const values = teamSlot.values.map(i => i.value.name);
          const lastOption = values.pop();
          const possibleOptions = values.join(", ") + " and" + lastOption;
          return handlerInput.responseBuilder
            .speak(`That has matched multiple teams. They are ${possibleOptions}. Which one would you like?`)
            .addElicitSlotDirective("Teams")
            .getResponse();
        }
        return handlerInput.responseBuilder.speak(`Great. you have picked ${teamSlot.values[0].value.name}`).getResponse();
      }
    }
    return handlerInput.responseBuilder
      .speak("Sorry, I didn't catch that. What team would you like?")
      .addElicitSlotDirective("Teams")
      .getResponse();
  }
};

const SetFavouriteTeamIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" && handlerInput.requestEnvelope.request.intent.name === "SetFavouriteTeamIntent"
    );
  },
  handle(handlerInput) {
    const teamSlot = getTeamSlot(handlerInput);

    if (teamSlot.status === "ER_SUCCESS_MATCH") {
      if (teamSlot.values.length > 0) {
        if (teamSlot.values.length > 1) {
          const values = teamSlot.values.map(i => i.value.name);
          const lastOption = values.pop();
          const possibleOptions = values.join(", ") + " and" + lastOption;
          return handlerInput.responseBuilder
            .speak(SetFavouriteTeamIntentSpeech.MatchedMultipleTeams(possibleOptions))
            .reprompt(SetFavouriteTeamIntentSpeech.MatchedMultipleTeams(possibleOptions))
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
            return handlerInput.responseBuilder
              .speak(SetFavouriteTeamIntentSpeech.FavouriteTeamSelected(favouriteTeam))
              .reprompt(SetFavouriteTeamIntentSpeech.FavouriteTeamSelectedReprompt)
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
      .speak(SetFavouriteTeamIntentSpeech.GetTeamSlot)
      .reprompt(SetFavouriteTeamIntentSpeech.GetTeamSlotReprompt)
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
          return handlerInput.responseBuilder
            .speak(GetFavouriteTeamIntentSpeech.SayFavouriteTeam(favouriteTeam))
            .reprompt(GetFavouriteTeamIntentSpeech.AnyMoreHelp)
            .getResponse();
        }
        return handlerInput.responseBuilder
          .speak(GetFavouriteTeamIntentSpeech.NoFavouriteTeam)
          .reprompt(GetFavouriteTeamIntentSpeech.AnyMoreHelp)
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

module.exports = {
  NextFixtureIntentHandler,
  SetFavouriteTeamIntentHandler,
  GetFavouriteTeamIntentHandler
};
