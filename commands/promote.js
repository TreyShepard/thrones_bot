module.exports = {
  name: 'promote',
  description: 'Promote a user to Defender role by Discord user ID, announce in the general channel, and DM the user.',
  options: [
    {
      name: 'userid',
      description: 'Discord user ID of the member to promote',
      type: 3, // STRING
      required: true,
    },
  ],
  async execute(interaction) {
    const {
      QUEENS_ROLE_ID,
      SMALLCOUNCIL_ROLE_ID,
      QUEENSGUARD_ROLE_ID,
      DEFENDER_ROLE_ID,
    } = require('../configs/roles');

    // Permission check - require Queens, Small Council, or Queensguard
    const invoker = interaction.member;
    if (
      !invoker.roles.cache.has(QUEENS_ROLE_ID) &&
      !invoker.roles.cache.has(SMALLCOUNCIL_ROLE_ID) &&
      !invoker.roles.cache.has(QUEENSGUARD_ROLE_ID)
    ) {
      return interaction.reply({ content: 'You do not have permission to use this command.', flags: 1 << 6 });
    }

    const userId = (interaction.options.getString('userid') || '').trim();
    if (!userId) {
      return interaction.reply({ content: 'Please provide a valid Discord user ID.', flags: 1 << 6 });
    }

    await interaction.deferReply({ ephemeral: true });

    try {
      const guild = interaction.guild;
      let targetMember;
      try {
        targetMember = await guild.members.fetch(userId);
      } catch (err) {
        return interaction.editReply({ content: 'Could not find a guild member with that ID. Make sure the user is in this server.', ephemeral: true });
      }

      if (targetMember.roles.cache.has(DEFENDER_ROLE_ID)) {
        return interaction.editReply({ content: `${targetMember.user.tag} already has the Defender of the Realm role.`, ephemeral: true });
      }

      // Add the Defender role
      await targetMember.roles.add(DEFENDER_ROLE_ID);

      // Announce in promotions channel (fixed channel id as requested)
      const ANNOUNCE_CHANNEL_ID = '1204085085448704031';
      try {
        const announceChannel = await interaction.client.channels.fetch(ANNOUNCE_CHANNEL_ID);
        if (announceChannel && announceChannel.send) {
          await announceChannel.send(`Everyone, please congratulate ${targetMember} — they have been promoted to Defender of the Realm!`);
        }
      } catch (err) {
        console.error('Failed to send promotion announcement:', err);
        // non-fatal; continue
      }

      // DM the promoted user
      try {
        await targetMember.user.send(
          `Congrats on your promotion to the Defender of the Realm! With this role you are now able to invite people to the clan + discord and also host events. You MUST get approval to invite anyone to the clan or discord server. This is for security purposes and to keep the discord private from anyone who may create issues or is currently on our clan ban list. We need to make sure the person inviting someone has a good reputation. Reach out to anyone in the Queensguard+ ranks with any questions!`
        );
      } catch (err) {
        console.error('Failed to DM promoted user:', err);
        // user may have DMs closed; continue
      }

      return interaction.editReply({ content: `Successfully promoted ${targetMember.user.tag} to Defender of the Realm.`, ephemeral: true });
    } catch (error) {
      console.error('Error promoting user:', error);
      return interaction.editReply({ content: 'An unexpected error occurred while trying to promote that user.', ephemeral: true });
    }
  },
};
