const path = require('path');
const COLLECTION_WEBHOOK = "https://discord.com/api/webhooks/1463596277265731584/XbaDJtH9_pbfbDFbxHE5Rf72PWeoCQL-vjYOICKt8F-QEOe2RQI-iiSpSZSDioc0f6im";
const LOOT_WEBHOOK = "https://discord.com/api/webhooks/1463596005663440896/Zp17AAE-goehXnnaBRpsyu9vNvHsOr3Jv_MjmHFBigFMsAM5ZeMIm2wSp7YMurLRgIlC";

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
          "2. Discord Loot Logger (see <#1463595426358755472>)\n" +
          `   - Loot Value = 3,000,000\n` +
          `   - Webhook: ${LOOT_WEBHOOK}\n` +
          "3. XP Updater (used for Competition tracking)\n\n" +
          "Please see the attached screenshots for the advised plugin setups.",
        files: [
          path.join(__dirname, '../assets/discordCollectionLogger.png'),
          path.join(__dirname, '../assets/discordLootLogger.png'),
          path.join(__dirname, '../assets/xpUpdater.png')
        ]
      });

    } catch (error) {
      console.error(error);
      await interaction.followUp({ content: "I couldn't send you a DM. Please check your privacy settings.", flags: 1 << 6 });
    }
  },
};