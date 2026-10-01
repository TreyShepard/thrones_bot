const { getPursuitState, updateItemStates } = require('./sheets');
const { fetchTextChannel, getInformationChannelId } = require('./channels');
const { createStartAnnouncement } = require('./announcements');

module.exports = {
  name: 'p4lstart',
  description: 'Choose and announce the next Pursuit for Loot item.',
  async execute(interaction) {
    await interaction.deferReply({ flags: 1 << 6 });

    try {
      const state = await getPursuitState();
      if (!state.active) {
        return interaction.editReply('Pursuit for Loot is currently disabled in the Settings tab.');
      }

      const activeItems = state.items.filter(item => item.isActive);
      if (activeItems.length) {
        return interaction.editReply(`An item is already active: **${activeItems[0].name}**.`);
      }

      if (!state.items.length) {
        return interaction.editReply('There are no available items to start.');
      }

      const informationChannel = await fetchTextChannel(
        interaction.client,
        getInformationChannelId(),
        'Information'
      );
      const item = state.items[Math.floor(Math.random() * state.items.length)];
      await updateItemStates(state.sheets, state.spreadsheetId, state.itemsTab, [{ rowNumber: item.rowNumber, isActive: true }]);
      try {
        await informationChannel.send(await createStartAnnouncement(item.name));
      } catch (sendError) {
        try {
          await updateItemStates(state.sheets, state.spreadsheetId, state.itemsTab, [{ rowNumber: item.rowNumber, isActive: false }]);
        } catch (rollbackError) {
          console.error('Failed to roll back the unannounced Pursuit for Loot item:', rollbackError);
          return interaction.editReply(`Discord rejected the announcement and the sheet rollback failed. **${item.name}** may still be active; check the Items tab.`);
        }

        console.error('Failed to post the Pursuit for Loot start announcement:', sendError);
        return interaction.editReply('Discord could not post in the Information channel. The sheet change was rolled back; grant the bot View Channel and Send Messages there, then retry.');
      }
      return interaction.editReply(`Started Pursuit for Loot with **${item.name}**.`);
    } catch (error) {
      console.error('Failed to start Pursuit for Loot:', error);
      if (error.code === 'P4L_CHANNEL_PERMISSION_ERROR') {
        return interaction.editReply(error.message);
      }
      return interaction.editReply('Could not start Pursuit for Loot. Check the bot logs and configuration.');
    }
  },
};