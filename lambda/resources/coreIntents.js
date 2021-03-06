const CoreIntentsSpeech = {
  FirstTimeIntroduction: `
    Hi. Welcome to the Rugby Guru. For now, I can give you an update on the latest result, and, next fixture for any team in the Gallagher Premiership and Guinness Six Nations.

    I will be looking to support more leagues soon.

    To get started, just say, "Next Fixture", or. "Last Result".
    `,
  FirstTimeIntroductionReprompt: `
    If you need help. Just say "help". To get started just say, "Next Fixture", or. "Last Result".
    `,
  Introduction: `
    Hi. Welcome back to the Rugby Guru. What can I help you with today?
  `,
  IntroductionFallback: `
    If you are unsure with what to do, just say "help". What can I help you with?
  `,
  FavouriteTeamNotSetIntroduction: `
    Hi. Welcome back to the Rugby Guru. I've noticed that you haven't set a favourite team yet. To do so, just say "Set my favourite team".

    What can I help you with today?
  `,
  Help: `
    At the moment, I can give you an update on the latest result and next fixture for any team in the Gallagher Premiership and Guinness Six Nations. Just say "Give me the next fixture" or "What was the last fixture".
  `,
  Goodbye: `
    Thanks for using the Rugby Guru. Goodbye!
  `,
  Fallback: `
    Sorry, I didn't understand that. Why don't you try saying it again?
  `,
  MatchedMultipleTeams: options => `
  That has matched multiple teams. They are ${options}. Which one would you like to pick?
  `,
  AnyMoreHelp: `
  What else can I help you with?
  `
};

module.exports = {
  CoreIntentsSpeech
};
