
/**
 * Ready Event Handler
 * This function is triggered once when the bot successfully connects to Discord
 * and is ready to start receiving events and processing commands
 */
module.exports = (client) => {
  // Log a confirmation message when the bot comes online
  // client.user.tag includes both username and discriminator (e.g., "BotName#1234")
  console.log(`Bot is online as ${client.user.tag}`);
  console.log('Thrones Bot is ready to serve!');
};
