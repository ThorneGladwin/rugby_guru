const { getTeamSlot } = require("../helpers/slotHelperFunctions");

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
        return handlerInput.responseBuilder
          .speak(`Great. you have picked ${teamSlot.values[0].value.name}`)
          .getResponse();
      }
    }
    return handlerInput.responseBuilder
      .speak("Sorry, I didn't catch that. What team would you like?")
      .addElicitSlotDirective("Teams")
      .getResponse();
  }
};

module.exports = {
  NextFixtureIntentHandler
};
