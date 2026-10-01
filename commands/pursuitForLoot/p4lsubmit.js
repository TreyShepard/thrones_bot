const { getPursuitState, updateItemStates } = require('./sheets');
const {
  getSubmissionsChannelId,
  fetchTextChannel,
  getInformationChannelId,
} = require('./channels');
const {
  createCrownAnnouncement,
  createNextItemAnnouncement,
  createPursuitCompleteAnnouncement,
} = require('./announcements');

module.exports = {
  name: 'p4lsubmit',
  description: 'Submit a screenshot for the active Pursuit for Loot item.',
  options: [
    {
      name: 'screenshot',
      description: 'Screenshot proving the item was obtained',
      type: 11,
      required: true,
    },
  ],
  async execute(interaction) {
    await interaction.deferReply({ flags: 1 << 6 });
    try {
      const screenshot = interaction.options.getAttachment('screenshot', true);
      if (screenshot.contentType && !screenshot.contentType.startsWith('image/')) {
        return interaction.editReply('The screenshot must be an image.');
      }

      const state = await getPursuitState();
      if (!state.active) {
        return interaction.editReply('Pursuit for Loot is currently disabled in the Settings tab.');
      }

      const activeItems = state.items.filter(item => item.isActive);
      if (activeItems.length !== 1) {
        return interaction.editReply(
          activeItems.length ? 'The sheet has multiple active items. Ask an administrator to fix it.' :
            'There is no active item to submit. Use `/p4lstart` first.'
        );
      }

      const currentItem = activeItems[0];
      const availableItems = state.items.filter(
        item => item.available && item.rowNumber !== currentItem.rowNumber
      );
      const nextItem = availableItems.length
        ? availableItems[Math.floor(Math.random() * availableItems.length)]
        : undefined;
      const submissionsChannel = await fetchTextChannel(
        interaction.client,
        getSubmissionsChannelId(),
        'Submissions'
      );
      const informationChannel = await fetchTextChannel(
        interaction.client,
        getInformationChannelId(),
        'Information'
      );

      await submissionsChannel.send({
        content: `${interaction.user} submitted proof for **${currentItem.name}**.`,
        files: [screenshot.url],
        allowedMentions: { users: [interaction.user.id] },
      });

      const itemChanges = [{ rowNumber: currentItem.rowNumber, available: false, isActive: false }];
      if (nextItem) itemChanges.push({ rowNumber: nextItem.rowNumber, isActive: true });
      await updateItemStates(state.sheets, state.spreadsheetId, state.itemsTab, itemChanges);

      await informationChannel.send(await createCrownAnnouncement(interaction.user.id, currentItem));

      if (nextItem) {
        await informationChannel.send(await createNextItemAnnouncement(nextItem.name));
        return interaction.editReply(`Submission posted. **${currentItem.name}** is complete; **${nextItem.name}** is now active.`);
      }

      await informationChannel.send(createPursuitCompleteAnnouncement());
      return interaction.editReply(`Submission posted. **${currentItem.name}** is complete; there are no available items remaining.`);
    } catch (error) {
      console.error('Failed to submit Pursuit for Loot proof:', error);
      if (error.code === 'P4L_CHANNEL_PERMISSION_ERROR') {
        return interaction.editReply(error.message);
      }
      return interaction.editReply('Could not process the submission. Check the bot logs and configuration.');
    }
  },
};