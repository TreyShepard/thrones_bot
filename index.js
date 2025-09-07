/**
 * Discord Bot Main Entry Point
 * This file initializes the Discord bot, loads commands and events,
 * and establishes the connection to Discord's servers
 */

// Load environment variables from .env file (for storing sensitive info)
require('dotenv').config();

const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const fs = require('fs'); 
const path = require('path');

// Create a new Discord client instance with required intents
// Intents specify which events the bot wants to receive from Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,        // Access to guild (server) information
    GatewayIntentBits.GuildMessages, // Access to messages in guilds
    GatewayIntentBits.GuildMembers,  // Access to guild member information
    GatewayIntentBits.MessageContent, // Access to message content (required for reading messages)
    GatewayIntentBits.GuildMessageReactions
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction,
    Partials.User
  ]
});

// Commands will be injected into this client.commands collection
client.commands = new Collection();

// Load commands from the commands directory
// Read all .js files from the commands folder and register them into the commands collection
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  // Store each command in the collection using its name as the key
  client.commands.set(command.name, command);
}

// Load events from the events directory
// These are handlers that respond to Discord events
// Read all .js files from the events folder and register them as event listeners (client.on)
const eventFiles = fs.readdirSync(path.join(__dirname, 'events')).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  const eventName = path.parse(file).name;
  console.log(`Loading event: ${file}, typeof export: ${typeof event}`);
  if (typeof event === 'function') {
    client.on(eventName, (...args) => event(client, ...args));
  } else {
    console.warn(`Event file ${file} does not export a function and was skipped.`);
  }
}

// Handle slash commands (interactions)
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error executing that command.', ephemeral: true });
  }
});

// Login to Discord using the bot token from environment variables (in .env file)
// This establishes the connection and brings the bot online
client.login(process.env.DISCORD_TOKEN);