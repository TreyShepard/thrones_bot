/**
 * Ping Command
 * A simple test command that responds with "Pong!" when triggered
 * Useful for checking if the bot is responsive and working properly
 */

//example command (can be useful to test if the bot is online/accessible)
//application permissions required: SEND_MESSAGES, READ_MESSAGES
module.exports = {
  name: 'ping', // Command name that users will type (e.g., .ping)
  execute(message, args) {
    // Actions resulting from the command call
    // In this case - Reply to the user's message with "Pong!"
    message.reply('Pong!');
  }
};

