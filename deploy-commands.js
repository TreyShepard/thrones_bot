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