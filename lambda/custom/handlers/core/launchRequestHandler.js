const get = require("lodash/get");
const { CoreIntentsSpeech } = require("../../resources/coreIntents");
const { ErrorsSpeech } = require("../../resources/errorIntent");

module.exports = {
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