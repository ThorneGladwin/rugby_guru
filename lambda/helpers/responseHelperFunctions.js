const { format, differenceInDays, isYesterday, isToday } = require("date-fns");
const { NextFixtureIntentSpeech, LastResultIntentSpeech } = require("../resources/customIntents");
const { CoreIntentsSpeech } = require("../resources/coreIntents");
const { ErrorsSpeech } = require("../resources/errorIntent");
const { isSessionNew } = require("../helpers/requestHelperFunctions");

const constructNextFixtureResponse = (handlerInput, selectedTeam, fixture) => {
  if(fixture) {
    const isHome = selectedTeam === fixture.home;
    const oppositeTeam = isHome ? fixture.away : fixture.home;
    const [day, month, year] = fixture.date.split("-");
    const gameDay = format(`${year}/${month}/${day}`, "dddd [the] Do [of] MMMM");
    const daysFromNow = differenceInDays(new Date(format(`${year}/${month}/${day}`)), new Date()) + 1;

    speech = isHome
      ? NextFixtureIntentSpeech.NextFixtureHome(selectedTeam, oppositeTeam, gameDay, daysFromNow)
      : NextFixtureIntentSpeech.NextFixtureAway(selectedTeam, oppositeTeam, gameDay, daysFromNow);
  } else {
    speech = NextFixtureIntentSpeech.NoNextFixture(selectedTeam);
  }

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

const constructLastResultResponse = (handlerInput, selectedTeam, fixture) => {
  let speech;
  if(fixture) {
    const isHome = selectedTeam === fixture.home;
    const oppositeTeam = isHome ? fixture.away : fixture.home;
    const [day, month, year] = fixture.date.split("-");
    const gameDay = format(`${year}/${month}/${day}`, "dddd [the] Do [of] MMMM");
    const homeScore = fixture.homeScore;
    const awayScore = fixture.awayScore;
    if (homeScore && awayScore) {
      const isDraw = homeScore === awayScore;
      const isHomeWin = !isDraw && parseInt(homeScore) > parseInt(awayScore);
  
      // Home Draw
      if (isDraw && isHome) {
        return isSessionNew(handlerInput)
          ? handlerInput.responseBuilder
              .speak(LastResultIntentSpeech.LastResultDrawHome(selectedTeam, oppositeTeam, gameDay, homeScore))
              .withShouldEndSession(true)
              .getResponse()
          : handlerInput.responseBuilder
              .speak(
                LastResultIntentSpeech.LastResultDrawHome(selectedTeam, oppositeTeam, gameDay, homeScore).concat(` ${CoreIntentsSpeech.AnyMoreHelp}`)
              )
              .reprompt(CoreIntentsSpeech.AnyMoreHelp)
              .getResponse();
      }
  
      // Away Draw
      if (isDraw && !isHome) {
        return isSessionNew(handlerInput)
          ? handlerInput.responseBuilder
              .speak(LastResultIntentSpeech.LastResultDrawAway(selectedTeam, oppositeTeam, gameDay, homeScore))
              .withShouldEndSession(true)
              .getResponse()
          : handlerInput.responseBuilder
              .speak(
                LastResultIntentSpeech.LastResultDrawAway(selectedTeam, oppositeTeam, gameDay, homeScore).concat(` ${CoreIntentsSpeech.AnyMoreHelp}`)
              )
              .reprompt(CoreIntentsSpeech.AnyMoreHelp)
              .getResponse();
      }
  
      // Home Win
      if (isHome && isHomeWin) {
        return isSessionNew(handlerInput)
          ? handlerInput.responseBuilder
              .speak(LastResultIntentSpeech.LastResultWinHome(selectedTeam, oppositeTeam, gameDay, homeScore, awayScore))
              .withShouldEndSession(true)
              .getResponse()
          : handlerInput.responseBuilder
              .speak(
                LastResultIntentSpeech.LastResultWinHome(selectedTeam, oppositeTeam, gameDay, homeScore, awayScore).concat(
                  ` ${CoreIntentsSpeech.AnyMoreHelp}`
                )
              )
              .reprompt(CoreIntentsSpeech.AnyMoreHelp)
              .getResponse();
      }
  
      // Away Win
      if (!isHome && !isHomeWin) {
        return isSessionNew(handlerInput)
          ? handlerInput.responseBuilder
              .speak(LastResultIntentSpeech.LastResultWinAway(selectedTeam, oppositeTeam, gameDay, awayScore, homeScore))
              .withShouldEndSession(true)
              .getResponse()
          : handlerInput.responseBuilder
              .speak(
                LastResultIntentSpeech.LastResultWinAway(selectedTeam, oppositeTeam, gameDay, awayScore, homeScore).concat(
                  ` ${CoreIntentsSpeech.AnyMoreHelp}`
                )
              )
              .reprompt(CoreIntentsSpeech.AnyMoreHelp)
              .getResponse();
      }
  
      // Home Lose
      if (isHome && !isHomeWin) {
        return isSessionNew(handlerInput)
          ? handlerInput.responseBuilder
              .speak(LastResultIntentSpeech.LastResultLostHome(selectedTeam, oppositeTeam, gameDay, awayScore, homeScore))
              .withShouldEndSession(true)
              .getResponse()
          : handlerInput.responseBuilder
              .speak(
                LastResultIntentSpeech.LastResultLostHome(selectedTeam, oppositeTeam, gameDay, awayScore, homeScore).concat(
                  ` ${CoreIntentsSpeech.AnyMoreHelp}`
                )
              )
              .reprompt(CoreIntentsSpeech.AnyMoreHelp)
              .getResponse();
      }
  
      // Away Lose
      if (!isHome && isHomeWin) {
        return isSessionNew(handlerInput)
          ? handlerInput.responseBuilder
              .speak(LastResultIntentSpeech.LastResultLostAway(selectedTeam, oppositeTeam, gameDay, homeScore, awayScore))
              .withShouldEndSession(true)
              .getResponse()
          : handlerInput.responseBuilder
              .speak(
                LastResultIntentSpeech.LastResultLostAway(selectedTeam, oppositeTeam, gameDay, homeScore, awayScore).concat(
                  ` ${CoreIntentsSpeech.AnyMoreHelp}`
                )
              )
              .reprompt(CoreIntentsSpeech.AnyMoreHelp)
              .getResponse();
      }
  
      // Unhandled Result
      return handlerInput.responseBuilder
        .speak(ErrorsSpeech.GenericError)
        .withShouldEndSession(true)
        .getResponse();
    }
    if (isToday(`${year}/${month}/${day}`)) {
      return isSessionNew(handlerInput)
        ? handlerInput.responseBuilder
            .speak(LastResultIntentSpeech.NoResultYetToday(selectedTeam, oppositeTeam))
            .withShouldEndSession(true)
            .getResponse()
        : handlerInput.responseBuilder
            .speak(LastResultIntentSpeech.NoResultYetToday(selectedTeam, oppositeTeam).concat(` ${CoreIntentsSpeech.AnyMoreHelp}`))
            .reprompt(CoreIntentsSpeech.AnyMoreHelp)
            .getResponse();
    }
  
    if (isYesterday(`${year}/${month}/${day}`)) {
      return isSessionNew(handlerInput)
        ? handlerInput.responseBuilder
            .speak(LastResultIntentSpeech.NoResultYetYesterday(selectedTeam, oppositeTeam))
            .withShouldEndSession(true)
            .getResponse()
        : handlerInput.responseBuilder
            .speak(LastResultIntentSpeech.NoResultYetYesterday(selectedTeam, oppositeTeam).concat(` ${CoreIntentsSpeech.AnyMoreHelp}`))
            .reprompt(CoreIntentsSpeech.AnyMoreHelp)
            .getResponse();
    }
  
    return isSessionNew(handlerInput)
      ? handlerInput.responseBuilder
          .speak(LastResultIntentSpeech.NoResultYet(selectedTeam, oppositeTeam, gameDay))
          .withShouldEndSession(true)
          .getResponse()
      : handlerInput.responseBuilder
          .speak(LastResultIntentSpeech.NoResultYet(selectedTeam, oppositeTeam, gameDay).concat(` ${CoreIntentsSpeech.AnyMoreHelp}`))
          .reprompt(CoreIntentsSpeech.AnyMoreHelp)
          .getResponse();
  }

  return isSessionNew(handlerInput)
  ? handlerInput.responseBuilder
      .speak(LastResultIntentSpeech.NoPreviousFixture(selectedTeam))
      .withShouldEndSession(true)
      .getResponse()
  : handlerInput.responseBuilder
      .speak(LastResultIntentSpeech.NoPreviousFixture(selectedTeam).concat(` ${CoreIntentsSpeech.AnyMoreHelp}`))
      .reprompt(CoreIntentsSpeech.AnyMoreHelp)
      .getResponse();
};

module.exports = {
  constructNextFixtureResponse,
  constructLastResultResponse
};
