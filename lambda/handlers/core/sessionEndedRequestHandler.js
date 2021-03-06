const { CoreIntentsSpeech } = require("../../resources/coreIntents");

module.exports = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === "SessionEndedRequest";
    },
    handle(handlerInput) {
      console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
  
      return handlerInput.responseBuilder.speak(CoreIntentsSpeech.Goodbye).getResponse();
    }
  };