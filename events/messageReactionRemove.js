const emojiRoles = require('../configs/emojiRoles');
const { ROLE_REACTION_MESSAGE_ID } = require('../configs/reactionMessages');

module.exports = async (client, reaction, user) => {
  if (user.bot) return;

  // Only process reactions for your target message
  if (reaction.message.id !== ROLE_REACTION_MESSAGE_ID) return;

  // Get emoji name (custom emoji or unicode)
  const emojiName = reaction.emoji.name;

  // Find the role ID for this emoji
  const roleId = emojiRoles[emojiName];
  if (!roleId) return; // No role mapped for this emoji

  const guild = reaction.message.guild;
  if (!guild) return;

  try {
    const member = await guild.members.fetch(user.id);
    await member.roles.remove(roleId);
    console.log(`Removed role ${roleId} from ${user.tag} for removing ${emojiName} reaction.`);
  } catch (error) {
    console.error(`Failed to remove role: ${error}`);
  }
};