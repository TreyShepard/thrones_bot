/**
 * Message Create Event Handler
 * This function is triggered whenever a new message is sent in any channel the bot has access to
 * It processes commands that start with a '.' prefix
 */
module.exports = (client, message) => {
  // Ignore messages that don't start with '.' (our command prefix) or messages from bots
  if (!message.content.startsWith('.') || message.author.bot) return;

  // Parse the message content into command and arguments
  // e.g., you can add functionality to commands...
    // .bingo <user> could show bingo results for specific users
    // .bingo results could show overall results
    // .bingo help could show help information for the bingo command
    // .bingo leaderboard could show results leaderboard by person
    // ...lots can be added to a single command.
  // Remove the prefix, trim whitespace, and split by spaces
  const args = message.content.slice(1).trim().split(/ +/);
  

  // Extract the command name (first word) and convert to lowercase
  const commandName = args.shift().toLowerCase();

  // Look up the command in the client's command collection
  // These are found in the client.commands collection (collection directory -> clients.commands.name)
  const command = client.commands.get(commandName);
  
  // If a valid command cannot be found, we again ignore the message
  if (!command) return;

  // Execute the command and handle any errors
  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('There was an error trying to execute that command.');
  }
};
