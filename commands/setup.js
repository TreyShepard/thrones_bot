const path = require('path');
const COLLECTION_WEBHOOK = "https://discord.com/api/webhooks/1282421845198373095/KoV3fyDEU1QK-LdtulyNVqd6yNc5wBEW7OlvtZjj_g5T4PHifND1T1LkDC9QXcY2MZEV";

module.exports = {
  name: "setup",
  description: "Sends you Runelite plugin instructions via DM.",
  async execute(interaction) {
    try {
      await interaction.reply({ content: "Check your DMs for setup instructions!", flags: 1 << 6 });

      const user = interaction.user;

      // Send instructions and images in one message
      await user.send({
        content:
          "**__Runelite Plugin Setup Instructions__**\n\n" +
          "Hey there! We use the following plugins:\n" +
          "1. Discord Collection Logger (see <#1282421548074012784>)\n" +
          `   - Webhook: ${COLLECTION_WEBHOOK}\n` +
          "2. Discord Loot Logger (see <#1282421548074012784>)\n" +
          `   - Webhook: ${COLLECTION_WEBHOOK}\n` +
          "3. XP Updater (used for Competition tracking)\n\n" +
          "Please see the attached screenshots for the advised plugin setups.",
        files: [
          path.join(__dirname, '../assets/discordCollectionLogger.png'),
          path.join(__dirname, '../assets/xpUpdater.png')
        ]
      });

    } catch (error) {
      console.error(error);
      await interaction.followUp({ content: "I couldn't send you a DM. Please check your privacy settings.", flags: 1 << 6 });
    }
  },
};