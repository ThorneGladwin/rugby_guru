const CoreIntentsSpeech = {
  FirstTimeIntroduction: `
    Hi. welcome to the rugby guru. For now, I can give you an update on the latest result and next fixture for any team in the Gallagher Premiership.

    I will be looking to support more leagues soon.

    To get started, just say, "Next Fixture", or. "Last Result".
    `,
  FirstTimeIntroductionReprompt: `
    If you need help. Just say "help". To get started just say, "Next Fixture", or. "Last Result".
    `,
  Introduction: `
    Hi. Welcome back to the Rugby Guru. What can I help with today?
  `,
  IntroductionFallback: `
    If you are unsure with what to do, just say "help". What can I help you with?
  `,
  FavouriteTeamNotSetIntroduction: `
    Hi. Welcome back to the Rugby Guru. I've noticed that you haven't set a favourite team yet. To do so, just say "Set my favourite team".

    What can I help you with today?
  `,
  Help: `
    At the moment I can give you an update on the latest result and next fixture for any team in the Gallagher Premiership. Just say "Give me the next fixture" or "What was the last fixture".
  `,
  Goodbye: `
    Goodbye!
  `,
  Fallback: `
    Sorry, I didn't understand that. Why don't you try saying it again?
  `
};

module.exports = {
  CoreIntentsSpeech
};
