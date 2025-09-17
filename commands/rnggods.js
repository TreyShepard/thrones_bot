module.exports = {
  name: "rnggods",
  description: "Ask the RNG gods a yes or no question.",
  options: [
    {
      name: "question",
      description: "Your yes or no question",
      type: 3, // STRING
      required: true,
    },
  ],
  async execute(interaction) {
    const answers = [
      "Yes.",
      "No.",
      "Maybe.",
      "Ask again later.",
      "Definitely!",
      "Absolutely not.",
      "It is certain.",
      "Very doubtful.",
      "Without a doubt.",
      "My sources say no.",
      "You may rely on it.",
      "Cannot predict now.",
      "Most likely.",
      "Don't count on it.",
      "Outlook good.",
      "Outlook not so good.",
      "You will go extremely dry.",
      "No, but someone else will.",
      "Nope, you've used up all of your RNG."
    ];

    const question = interaction.options.getString("question");
    const answer = answers[Math.floor(Math.random() * answers.length)];

    await interaction.reply({
      content: `🙏 **Question:** ${question}\n**RNG Gods say:** ${answer}`,
    });
  },
};