const SetFavouriteTeamIntentSpeech = {
    MatchedMultipleTeams: (options) => `That has matched multiple teams. They are ${options}. Which one would you like to pick?`,
    FavouriteTeamSelected: (team) => `Great. I have saved ${team} as your favourite team. What else can I help you with?`,
    FavouriteTeamSelectedReprompt: `What else can I help you with?`,
    GetTeamSlot: `Sorry, I didn't catch that. What team would you like to pick?`,
    GetTeamSlotReprompt: `What team would you like to pick?`
};

const GetFavouriteTeamIntentSpeech = {
    SayFavouriteTeam: (team) => `You have set ${team} as your favourite team. What else can I help you with?`,
    NoFavouriteTeam: `You have not set a favourite team yet. What else can I help you with?`,
    AnyMoreHelp: `What else can I help you with?`
}

module.exports = {
    SetFavouriteTeamIntentSpeech,
    GetFavouriteTeamIntentSpeech
};