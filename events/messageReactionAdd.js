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
    await member.roles.add(roleId);
    console.log(`Assigned role ${roleId} to ${user.tag} for reacting with ${emojiName}.`);
  } catch (error) {
    console.error(`Failed to assign role: ${error}`);
  }
};