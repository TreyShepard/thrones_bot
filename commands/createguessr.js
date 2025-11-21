const crypto = require('crypto');
const { getSheetsClient } = require('../utils/googleSheets');

module.exports = {
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

  async execute(interaction) {
    await interaction.deferReply();

    const question = interaction.options.getString('question');
    const priceIsRight = interaction.options.getBoolean('priceisright') ?? false;
    const submittedDiscordUserId = interaction.user.id;

    // Generate a UUID for competitionId
    let competitionId;
    if (crypto.randomUUID) {
      competitionId = crypto.randomUUID();
    } else {
      competitionId = crypto.createHash('sha1').update(Date.now() + Math.random().toString()).digest('hex');
    }

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    if (!spreadsheetId) {
      await interaction.editReply({ content: 'GOOGLE_SHEET_ID is not set in environment.' });
      return;
    }

    let sheets;
    try {
      sheets = await getSheetsClient();
    } catch (err) {
      console.error('Sheets auth error:', err);
      await interaction.editReply({ content: 'Failed to authenticate to Google Sheets. Check env vars.' });
      return;
    }

    // competitions sheet headers:
    // competitionId | submittedDiscordUserId | isCompleted | question | priceIsRight | winnerDiscordUserId
    const row = [
      competitionId,
      submittedDiscordUserId,
      'FALSE',
      question,
      priceIsRight ? 'TRUE' : 'FALSE',
      '',
    ];

    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'competitions!A:F',
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: { values: [row] },
      });

      await interaction.editReply({ 
        content: `🎯 **New ThronesGuessr Competition Created!**\n\n**Question:** ${question}\n**Competition ID:** \`${competitionId}\`\n**Created by:** ${interaction.member.displayName}${priceIsRight ? '\n**Rules:** Price Is Right mode enabled' : ''}` 
      });
    } catch (err) {
      console.error('Error appending to sheet:', err);
      let message = 'Failed to write to the Google Sheet. This is usually a permissions issue.';
      message += '\nIf using an API key, prefer using a Service Account and share the sheet with that account.';
      await interaction.editReply({ content: message });
    }
  },
};
