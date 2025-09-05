/**
 * Guild Member Add Event Handler
 * This function is triggered whenever a new member joins the server
 * It sends a private welcome message with instructions about setting their RSN
 * Additionally, it adds them to the Wildlings role.
 */

const { WILDLINGS_ROLE_ID } = require('../configs/roles');

module.exports = async (client, member) => {
  try {
    await sendWelcomeMessage(member);
    await assignWildlingsRole(member);
  } catch (error) {
    console.error(`Could not send welcome message to ${member.user.tag}:`, error);
  }
};

/**
 * Sends a welcome message to the new member
 * @param {import('discord.js').GuildMember} member The new member object.
 */
async function sendWelcomeMessage(member) {
  await member.send(
    'Reminder! Set your RSN as your Discord name in this server. It helps staff with bingo & helps people know who you are.'
  )
  .then(() => {
    console.log(`Welcome message sent to ${member.user.tag}`);
  })
  .catch(error => {
    console.error(`Could not send welcome message to ${member.user.tag}:`, error);
  });
}

/**
 * Assigns the Wildlings role to the new member
 * @param {import('discord.js').GuildMember} member The new member object.
 */
async function assignWildlingsRole(member) {
  try {
    await member.roles.add(WILDLINGS_ROLE_ID);
    console.log(`Wildlings role assigned successfully to ${member.user.tag}!`);
  } catch (error) {
    console.error(`Failed to assign Wildlings role to ${member.user.tag}:`, error);
    // Rethrowing the error allows the main try/catch block to handle it.
    throw error;
  }
}