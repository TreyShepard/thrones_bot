module.exports = {
  name: "help",
  description: "Lists all available bot commands and their usage.",
  async execute(interaction) {
    const helpText = `
**Available Commands**

</bingochamps:> — Displays Thrones V Bingo results.  
Usage: \`/bingochamps [mode:info|all]\`

</enabledrops:> — Enables drops for the server.  
Usage: \`/enabledrops\`

</rnggods:> — Ask the RNG gods a yes or no question.  
Usage: \`/rnggods question:<your question>\`

</setup:> — Sends you Runelite plugin instructions via DM.  
Usage: \`/setup\`
    `;

    await interaction.reply({ content: helpText, flags: 1 << 6 });
  },
};