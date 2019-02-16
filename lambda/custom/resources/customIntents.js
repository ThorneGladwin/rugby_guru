const customIntentsSpeech = {
    GetTeamSlotMisunderstood: `Sorry, I didn't catch that. What team would you like to pick?`,
    GetTeamSlot: `What team would you like to pick?`
};

const SetFavouriteTeamIntentSpeech = {
    FavouriteTeamSelected: (team) => `Great. I have saved ${team} as your favourite team.`,
};

const GetFavouriteTeamIntentSpeech = {
    SayFavouriteTeam: (team) => `You have set ${team} as your favourite team.`,
    NoFavouriteTeam: `You have not set a favourite team yet.`
};

const NextFixtureIntentSpeech = {
    NextFixtureHome: (team, oppositeTeam, date, daysFromNow) => `${team} next fixture is at home against ${oppositeTeam}. It will be played on ${date}, which is ${daysFromNow} days from now.`,
    NextFixtureAway: (team, oppositeTeam, date, daysFromNow) => `${team} next fixture is away against ${oppositeTeam}. It will be played on ${date}, which is ${daysFromNow} days from now.`
};

module.exports = {
    customIntentsSpeech,
    SetFavouriteTeamIntentSpeech,
    GetFavouriteTeamIntentSpeech,
    NextFixtureIntentSpeech
};