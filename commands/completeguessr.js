const { getSheetsClient } = require('../utils/googleSheets');

module.exports = {
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

  async execute(interaction) {
    await interaction.deferReply();

    const competitionId = interaction.options.getString('competitionid');
    const finalNumber = interaction.options.getNumber('finalnumber');
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
      // Get all competitions
      const competitionsResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'competitions!A:G',
      });

      const competitions = competitionsResponse.data.values || [];
      const competitionIndex = competitions.findIndex(row => row[0] === competitionId);

      if (competitionIndex === -1) {
        await interaction.deleteReply();
        await interaction.followUp({ content: `❌ Competition ID \`${competitionId}\` not found.`, ephemeral: true });
        return;
      }

      const competitionRow = competitions[competitionIndex];
      const submittedDiscordUserId = competitionRow[1];
      const isCompleted = competitionRow[2];
      const question = competitionRow[3];
      const priceIsRight = competitionRow[4] === 'TRUE';

      // Check if user is the competition creator
      if (submittedDiscordUserId !== discordUserId) {
        await interaction.deleteReply();
        await interaction.followUp({ content: '❌ Only the competition creator can complete this competition.', ephemeral: true });
        return;
      }

      // Check if already completed
      if (isCompleted === 'TRUE') {
        await interaction.deleteReply();
        await interaction.followUp({ content: '❌ This competition has already been completed.', ephemeral: true });
        return;
      }

      // Get all guesses for this competition
      const guessesResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'guesses!A:C',
      });

      const allGuesses = guessesResponse.data.values || [];
      const competitionGuesses = allGuesses.filter(row => row[0] === competitionId);

      let winnerId = null;
      let winningGuess = null;
      let closestDistance = Infinity;

      // Determine the winner
      if (competitionGuesses.length > 0) {
        for (const guessRow of competitionGuesses) {
          const guesserId = guessRow[1];
          const guess = parseFloat(guessRow[2]);

          // Skip invalid guesses
          if (isNaN(guess)) continue;

          // Price Is Right rule: guess cannot exceed final number
          if (priceIsRight && guess > finalNumber) continue;

          const distance = Math.abs(finalNumber - guess);

          if (distance < closestDistance) {
            closestDistance = distance;
            winnerId = guesserId;
            winningGuess = guess;
          }
        }
      }

      // Update the competition row: mark as completed, set winner, set final number
      // Row index is competitionIndex + 1 (1-indexed) + 1 (header row) if there's a header
      // Assuming row 1 is header, so the actual row number is competitionIndex + 2
      const rowNumber = competitionIndex + 1; // Adjust based on whether there's a header
      
      // Update isCompleted (column C), winnerDiscordUserId (column F), and finalNumber (column G)
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `competitions!C${rowNumber}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [['TRUE']] },
      });

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `competitions!F${rowNumber}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [[winnerId || '']] },
      });

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `competitions!G${rowNumber}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [[finalNumber]] },
      });

      // If there's a winner, update their win count
      if (winnerId) {
        const membersResponse = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: 'members!A:B',
        });

        const members = membersResponse.data.values || [];
        const memberIndex = members.findIndex(row => row[0] === winnerId);

        if (memberIndex !== -1) {
          const currentWins = parseInt(members[memberIndex][1] || '0');
          const memberRowNumber = memberIndex + 1;

          await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `members!B${memberRowNumber}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [[currentWins + 1]] },
          });
        }
      }

      // Build response message
      const submitter = await interaction.guild.members.fetch(submittedDiscordUserId);
      let responseMessage = `🏁 **ThronesGuessr Completed!**\n\n**Created by:** ${submitter.displayName}\n**Question:** ${question}\n**Final Number:** ${finalNumber}`;

      if (winnerId && winningGuess !== null) {
        responseMessage += `\n**Winner:** <@${winnerId}> with a guess of **${winningGuess}**! 🎉`;
      } else if (competitionGuesses.length === 0) {
        responseMessage += `\n**Winner:** No one - there were no guesses submitted.`;
      } else {
        responseMessage += `\n**Winner:** No valid guesses${priceIsRight ? ' (all guesses exceeded the final number in Price Is Right mode)' : ''}.`;
      }

      await interaction.editReply({ content: responseMessage });

    } catch (err) {
      console.error('Error completing competition:', err);
      await interaction.deleteReply();
      await interaction.followUp({ content: 'Failed to complete the competition. Please try again.', ephemeral: true });
    }
  },
};
