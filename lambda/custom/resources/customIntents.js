const customIntentsSpeech = {
  GetTeamSlotMisunderstood: `Sorry, I didn't catch that. What team would you like to pick?`,
  GetTeamSlot: `What team would you like to pick?`
};

const SetFavouriteTeamIntentSpeech = {
  FavouriteTeamSelected: team => `Great. I have saved ${team} as your favourite team.`
};

const GetFavouriteTeamIntentSpeech = {
  SayFavouriteTeam: team => `You have set ${team} as your favourite team.`,
  NoFavouriteTeam: `You have not set a favourite team yet.`
};

const NextFixtureIntentSpeech = {
  NextFixtureHome: (team, oppositeTeam, date, daysFromNow) =>
    `${team} next fixture is at home against ${oppositeTeam}. It will be played on ${date}, which is ${daysFromNow} days from now.`,
  NextFixtureAway: (team, oppositeTeam, date, daysFromNow) =>
    `${team} next fixture is away against ${oppositeTeam}. It will be played on ${date}, which is ${daysFromNow} days from now.`,
  NoNextFixture: team => `Unfortunately there are no fixtures coming up for ${team} for this season.`
};

const LastResultIntentSpeech = {
  LastResultWinHome: (team, oppositeTeam, date, winningScore, losingScore) =>
    `${team} beat ${oppositeTeam} at home on ${date}. They won by ${winningScore} points to ${losingScore}.`,
  LastResultWinAway: (team, oppositeTeam, date, winningScore, losingScore) =>
    `${team} beat ${oppositeTeam}, away on ${date}. They won by ${winningScore} points to ${losingScore}.`,
  LastResultLostHome: (team, oppositeTeam, date, winningScore, losingScore) =>
    `${team} lost to ${oppositeTeam} at home on ${date}. They lost by ${winningScore} points to ${losingScore}.`,
  LastResultLostAway: (team, oppositeTeam, date, winningScore, losingScore) =>
    `${team} lost to ${oppositeTeam}, away on ${date}. They lost by ${winningScore} points to ${losingScore}.`,
  LastResultDrawHome: (team, oppositeTeam, date, drawPoints) => `${team} drew to ${oppositeTeam} at home on ${date}. They drew ${drawPoints} all.`,
  LastResultDrawAway: (team, oppositeTeam, date, drawPoints) => `${team} drew to ${oppositeTeam}, away on ${date}. They drew ${drawPoints} all.`,
  NoResultYet: (team, oppositeTeam, date) =>
    `${team} played ${oppositeTeam} on ${date}. Unfortunately, I don't have a result yet. Please try again later.`,
  NoResultYetYesterday: (team, oppositeTeam) =>
    `${team} played ${oppositeTeam} yesterday. Unfortunately, I don't have a result yet. Please try again later.`,
  NoResultYetToday: (team, oppositeTeam) => `${team} played ${oppositeTeam} today. Unfortunately, I don't have a result yet. Please try again later.`,
  NoPreviousFixture: team => `Unfortunately there have been no previous fixtures for ${team} for this season.`
};

module.exports = {
  customIntentsSpeech,
  SetFavouriteTeamIntentSpeech,
  GetFavouriteTeamIntentSpeech,
  NextFixtureIntentSpeech,
  LastResultIntentSpeech
};
