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

const CROWN_ROLE_ID = '1555340881043783721';
const CROWN_LORE_CHANNEL_ID = '1555341394078601307';

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

      let crownAccessTransferred = false;
      try {
        const guild = interaction.guild;
        const crownRole = await guild.roles.fetch(CROWN_ROLE_ID);
        if (!crownRole) throw new Error(`Crown role ${CROWN_ROLE_ID} was not found.`);

        const submitter = await guild.members.fetch(interaction.user.id);
        await guild.members.fetch();
        const previousHolders = crownRole.members.filter(member => member.id !== submitter.id);
        await Promise.all(previousHolders.map(member => member.roles.remove(crownRole)));
        await submitter.roles.add(crownRole);
        crownAccessTransferred = true;

        try {
          await submitter.user.send(
            `You are now the only person with access to <#${CROWN_LORE_CHANNEL_ID}>. Please leave a message or some lore about how you earned the crown for future holders.`
          );
        } catch (error) {
          console.error('Failed to DM Pursuit for Loot crown holder:', error);
        }
      } catch (error) {
        console.error('Failed to transfer Pursuit for Loot crown role:', error);
      }

      await informationChannel.send(await createCrownAnnouncement(interaction.user.id, currentItem));

      if (nextItem) {
        await informationChannel.send(await createNextItemAnnouncement(nextItem.name));
        const handoffStatus = crownAccessTransferred ? '' : ' Crown role access could not be transferred; please contact an administrator.';
        return interaction.editReply(`Submission posted. **${currentItem.name}** is complete; **${nextItem.name}** is now active.${handoffStatus}`);
      }

      await informationChannel.send(createPursuitCompleteAnnouncement());
      const handoffStatus = crownAccessTransferred ? '' : ' Crown role access could not be transferred; please contact an administrator.';
      return interaction.editReply(`Submission posted. **${currentItem.name}** is complete; there are no available items remaining.${handoffStatus}`);
    } catch (error) {
      console.error('Failed to submit Pursuit for Loot proof:', error);
      if (error.code === 'P4L_CHANNEL_PERMISSION_ERROR') {
        return interaction.editReply(error.message);
      }
      return interaction.editReply('Could not process the submission. Check the bot logs and configuration.');
    }
  },
};