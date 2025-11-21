const { getSheetsClient } = require('../utils/googleSheets');

module.exports = {
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

  async execute(interaction) {
    await interaction.deferReply();

    const competitionId = interaction.options.getString('competitionid');
    const guess = interaction.options.getNumber('guess');
    const discordUserId = interaction.user.id;

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    if (!spreadsheetId) {
      await interaction.deleteReply();
      await interaction.followUp({ content: 'GOOGLE_SHEET_ID is not set in environment.', ephemeral: true });
      return;
    }

    let sheets;
    try {
      sheets = await getSheetsClient();
    } catch (err) {
      console.error('Sheets auth error:', err);
      await interaction.deleteReply();
      await interaction.followUp({ content: 'Failed to authenticate to Google Sheets. Check env vars.', ephemeral: true });
      return;
    }

    try {
      // Check if the competition exists
      const competitionsResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'competitions!A:F',
      });

      const competitions = competitionsResponse.data.values || [];
      const competitionRow = competitions.find(row => row[0] === competitionId);

      if (!competitionRow) {
        await interaction.deleteReply();
        await interaction.followUp({ content: `❌ Competition ID \`${competitionId}\` not found.`, ephemeral: true });
        return;
      }

      const competitionCreatorId = competitionRow[1];
      const competitionQuestion = competitionRow[3];

      // Check if competition is already completed
      if (competitionRow[2] === 'TRUE') {
        await interaction.deleteReply();
        await interaction.followUp({ content: '❌ This competition has already been completed.', ephemeral: true });
        return;
      }

      // Check if user has already guessed for this competition
      const guessesResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'guesses!A:C',
      });

      const guesses = guessesResponse.data.values || [];
      const existingGuess = guesses.find(row => row[0] === competitionId && row[1] === discordUserId);

      if (existingGuess) {
        await interaction.deleteReply();
        await interaction.followUp({ content: '❌ You have already submitted a guess for this competition.', ephemeral: true });
        return;
      }

      // Check if user exists in members sheet, if not add them
      const membersResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'members!A:B',
      });

      const members = membersResponse.data.values || [];
      const memberExists = members.some(row => row[0] === discordUserId);

      if (!memberExists) {
        // Add new member with 0 wins
        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: 'members!A:B',
          valueInputOption: 'USER_ENTERED',
          insertDataOption: 'INSERT_ROWS',
          requestBody: { values: [[discordUserId, '0']] },
        });
      }

      // Submit the guess
      const guessRow = [competitionId, discordUserId, guess];

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'guesses!A:C',
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: { values: [guessRow] },
      });

      // Get the competition creator's member info
      const competitionCreator = await interaction.guild.members.fetch(competitionCreatorId);
      const competitionCreatorName = competitionCreator.displayName;

      await interaction.editReply({ 
        content: `📊 **${interaction.member.displayName}** submitted a guess of **${guess}** for **${competitionCreatorName}**'s ThronesGuessr of "${competitionQuestion}"` 
      });

    } catch (err) {
      console.error('Error processing guess:', err);
      await interaction.deleteReply();
      await interaction.followUp({ content: 'Failed to process your guess. Please try again.', ephemeral: true });
    }
  },
};
