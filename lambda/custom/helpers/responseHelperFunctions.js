const { format, differenceInDays } = require("date-fns");
const { NextFixtureIntentSpeech } = require("../resources/customIntents");
const { CoreIntentsSpeech } = require("../resources/coreIntents");
const { isSessionNew } = require("../helpers/requestHelperFunctions");

const constructNextFixtureResponse = (handlerInput, selectedTeam, fixture) => {
  const isHome = selectedTeam === fixture.home;
  const oppositeTeam = isHome ? fixture.away : fixture.home;
  const [day, month, year] = fixture.date.split("-");
  const gameDay = format(`${year}/${month}/${day}`, "dddd [the] Do [of] MMMM");
  const daysFromNow = differenceInDays(new Date(format(`${year}/${month}/${day}`)), new Date()) + 1;
  const speech = isHome
    ? NextFixtureIntentSpeech.NextFixtureHome(selectedTeam, oppositeTeam, gameDay, daysFromNow)
    : NextFixtureIntentSpeech.NextFixtureAway(selectedTeam, oppositeTeam, gameDay, daysFromNow);

  return isSessionNew(handlerInput)
    ? handlerInput.responseBuilder
        .speak(speech)
        .withShouldEndSession(true)
        .getResponse()
    : handlerInput.responseBuilder
        .speak(speech.concat(` ${CoreIntentsSpeech.AnyMoreHelp}`))
        .reprompt(CoreIntentsSpeech.AnyMoreHelp)
        .getResponse();
};

module.exports = {
  constructNextFixtureResponse
};
