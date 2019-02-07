const CoreIntentsSpeech = {
  FirstTimeIntroduction: `
    Hi. welcome to the rugby guru. For now, I can give you an update on the latest result and next fixture for any team in the Gallagher Premiership.

    I will be looking to support more leagues soon.

    To get started, just say, "Next Fixture", or. "Last Result".
    `,
  FirstTimeIntroductionReprompt: `
    If you need help. Just say "help". To get started just say, "Next Fixture", or. "Last Result".
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
