const get = require("lodash/get");
const { CoreIntentsSpeech } = require("../resources/coreIntents");
const { ErrorsSpeech } = require("../handlers/errorHandler");

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "LaunchRequest";
  },
  handle(handlerInput) {
    return handlerInput.attributesManager.getPersistentAttributes().then(attributes => {
      const favouriteTeam = get(attributes, ["favouriteTeam"]);
      let usedOnce = get(attributes, ["usedOnce"], false);
      let timesWithoutFavourite = get(attributes, ["timesWithoutFavourite"], 0);
      if (usedOnce) {
        if (favouriteTeam || (timesWithoutFavourite > 0 && timesWithoutFavourite < 5)) {
          const newAttributes = {
            ...attributes,
            timesWithoutFavourite: favouriteTeam ? 1 : timesWithoutFavourite + 1
          };
          handlerInput.attributesManager.setPersistentAttributes(newAttributes);
          return handlerInput.attributesManager
            .savePersistentAttributes()
            .then(() => {
              return handlerInput.responseBuilder
                .speak(CoreIntentsSpeech.Introduction)
                .reprompt(CoreIntentsSpeech.IntroductionFallback)
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

        const newAttributes = {
          ...attributes,
          timesWithoutFavourite: 1
        };
        handlerInput.attributesManager.setPersistentAttributes(newAttributes);

        return handlerInput.attributesManager
          .savePersistentAttributes()
          .then(() => {
            return handlerInput.responseBuilder
              .speak(CoreIntentsSpeech.FavouriteTeamNotSetIntroduction)
              .reprompt(CoreIntentsSpeech.IntroductionFallback)
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
      const newAttributes = {
        ...attributes,
        usedOnce: true
      };
      handlerInput.attributesManager.setPersistentAttributes(newAttributes);
      return handlerInput.attributesManager
        .savePersistentAttributes()
        .then(() => {
          return handlerInput.responseBuilder
            .speak(CoreIntentsSpeech.FirstTimeIntroduction)
            .reprompt(CoreIntentsSpeech.FirstTimeIntroductionReprompt)
            .getResponse();
        })
        .catch(error => {
          console.error(error);
          return handlerInput.responseBuilder
            .speak(ErrorsSpeech.GenericError)
            .withShouldEndSession(true)
            .getResponse();
        });
    });
  }
};

const FallbackIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" && handlerInput.requestEnvelope.request.intent.name === "AMAZON.FallbackIntent"
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(CoreIntentsSpeech.Fallback)
      .reprompt(CoreIntentsSpeech.Fallback)
      .getResponse();
  }
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "IntentRequest" && handlerInput.requestEnvelope.request.intent.name === "AMAZON.HelpIntent";
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(CoreIntentsSpeech.Help)
      .reprompt(CoreIntentsSpeech.Help)
      .getResponse();
  }
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      (handlerInput.requestEnvelope.request.intent.name === "AMAZON.CancelIntent" ||
        handlerInput.requestEnvelope.request.intent.name === "AMAZON.StopIntent")
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.speak(CoreIntentsSpeech.Goodbye).getResponse();
  }
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "SessionEndedRequest";
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.speak(CoreIntentsSpeech.Goodbye).getResponse();
  }
};

module.exports = {
  LaunchRequestHandler,
  HelpIntentHandler,
  CancelAndStopIntentHandler,
  SessionEndedRequestHandler,
  FallbackIntentHandler
};
