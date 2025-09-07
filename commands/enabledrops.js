// Thrones V Enable Drops Command
// Command: !enableDrops
module.exports = {
  name: "enabledrops",
  description: "Enables drops for the clan.",
  async execute(interaction) {
    await interaction.reply("Drops have been enabled for the clan! Enjoy your rewards!");
  },
};