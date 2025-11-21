const { REST, Routes } = require('discord.js');
require('dotenv').config();

const commands = [
  {
    name: 'announce',
    description: 'Sends an announcement to the specified channel.',
    options: [
      {
        name: 'channel',
        description: 'Channel to send the announcement',
        type: 7, // CHANNEL
        required: true,
      },
      {
        name: 'message',
        description: 'Announcement text',
        type: 3, // STRING
        required: true,
      },
      {
        name: 'photo',
        description: 'Attach a photo to the announcement',
        type: 11, // ATTACHMENT
        required: false,
      },
    ],
  },
  {
    name: 'bingochamps',
    description: 'Displays Thrones V Bingo results.',
    options: [
      {
        name: 'mode',
        description: 'Choose "info" for tracking sheet, "all" for full details, or leave blank for summary.',
        type: 3, // STRING
        required: false,
        choices: [
          { name: 'info', value: 'info' },
          { name: 'all', value: 'all' }
        ]
      }
    ],
  },
  {
    name: 'enabledrops',
    description: 'Enables drops for the server.',
  },
  {
    name: 'rnggods',
    description: 'Ask the RNG gods a yes or no question.',
    options: [
      {
        name: 'question',
        description: 'Your yes or no question',
        type: 3, // STRING
        required: true,
      },
    ],
  },
  {
    name: 'help',
    description: 'Lists all available bot commands and their usage.',
  },
  {
    name: 'setup',
    description: 'Sends you Runelite plugin instructions via DM.',
  },
  {
    name: 'promote',
    description: 'Promote a user to Defender role by Discord user ID, announce, and DM the user.',
    options: [
      {
        name: 'userid',
        description: 'Discord user ID of the member to promote',
        type: 3, // STRING
        required: true,
      },
    ],
  },
  {
    name: 'killcount',
    description: 'Get a player\'s killcount for a specific boss.',
    options: [
      {
        name: 'playername',
        description: 'The player\'s RuneScape name',
        type: 3, // STRING
        required: true,
      },
      {
        name: 'bossname',
        description: 'The boss name (e.g. zulrah, vorkath, cerberus, etc.)',
        type: 3, // STRING
        required: true,
      }
    ],
  },
  {
    name: 'createguessr',
    description: 'Create a new Guessr competition.',
    options: [
      {
        name: 'question',
        description: 'The question for people to guess',
        type: 3, // STRING
        required: true,
      },
      {
        name: 'priceisright',
        description: 'Use Price Is Right rules?',
        type: 5, // BOOLEAN
        required: false,
      },
    ],
  },
  {
    name: 'guessrguess',
    description: 'Submit your guess for a ThronesGuessr competition.',
    options: [
      {
        name: 'competitionid',
        description: 'The competition ID to guess for',
        type: 3, // STRING
        required: true,
      },
      {
        name: 'guess',
        description: 'Your numeric guess',
        type: 10, // NUMBER
        required: true,
      },
    ],
  },
  {
    name: 'completeguessr',
    description: 'Complete a Guessr competition and determine the winner.',
    options: [
      {
        name: 'competitionid',
        description: 'The competition ID to complete',
        type: 3, // STRING
        required: true,
      },
      {
        name: 'finalnumber',
        description: 'The final/actual number',
        type: 10, // NUMBER
        required: true,
      },
    ],
  },
  {
    name: 'guessrleaderboard',
    description: 'Display the top 3 ThronesGuessr winners.',
  },
  {
    name: 'activeguessrs',
    description: 'Display all active ThronesGuessr competitions.',
  },
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Registering slash commands...');
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log('Slash commands registered!');
  } catch (error) {
    console.error(error);
  }
})();