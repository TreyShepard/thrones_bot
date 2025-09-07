const { QUEENS_ROLE_ID, SMALL_COUNCIL_ROLE_ID, DEFENDER_ROLE_ID } = require('../configs/roles');

module.exports = {
  name: "announce",
  description: "Sends an announcement to the specified channel.",
  async execute(interaction) {
    // Permission check - enforces that the calling member has the Queens or Small Council role
    const member = interaction.member;
    if (
      !member.roles.cache.has(QUEENS_ROLE_ID) &&
      !member.roles.cache.has(SMALL_COUNCIL_ROLE_ID)
    ) {
      return interaction.reply({ content: "You do not have permission to use this command.", ephemeral: true });
    }

    // Get options from slash command
    const targetChannel = interaction.options.getChannel('channel');
    const announcement = interaction.options.getString('message');

    if (!targetChannel) {
      return interaction.reply({ content: 'Please mention a valid channel.', ephemeral: true });
    }
    if (!announcement) {
      return interaction.reply({ content: 'Please provide an announcement message.', ephemeral: true });
    }

    // Send the announcement
    await targetChannel.send(`${announcement}`);
    await interaction.reply({ content: `Announcement sent to ${targetChannel}!`, ephemeral: true });
  },
};