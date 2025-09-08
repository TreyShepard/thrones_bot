const { QUEENS_ROLE_ID, SMALL_COUNCIL_ROLE_ID, DEFENDER_ROLE_ID } = require('../configs/roles');

module.exports = {
  name: "announce",
  description: "Sends an announcement to the specified channel.",
  async execute(interaction) {
    const member = interaction.member;
    if (
      !member.roles.cache.has(QUEENS_ROLE_ID) &&
      !member.roles.cache.has(SMALL_COUNCIL_ROLE_ID)
    ) {
      return interaction.reply({ content: "You do not have permission to use this command.", flags: 1 << 6 });
    }

    const targetChannel = interaction.options.getChannel('channel');
    const announcement = interaction.options.getString('message');
    const photo = interaction.options.getAttachment('photo');

    if (!targetChannel) {
      return interaction.reply({ content: 'Please mention a valid channel.', flags: 1 << 6 });
    }
    if (!announcement) {
      return interaction.reply({ content: 'Please provide an announcement message.', flags: 1 << 6 });
    }

    // Prepare message payload
    const payload = { content: announcement };
    if (photo) {
      payload.files = [photo.url];
    }

    await targetChannel.send(payload);
    await interaction.reply({ content: `Announcement sent to ${targetChannel}!`, flags: 1 << 6 });
  },
};