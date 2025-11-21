const { getSheetsClient } = require('../utils/googleSheets');

module.exports = {
  name: 'activeguessrs',
  description: 'Display all active ThronesGuessr competitions.',

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

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
        range: 'competitions!A:H',
      });

      const competitions = competitionsResponse.data.values || [];
      
      // Filter for active competitions (isCompleted = FALSE), skip header row and empty rows
      const activeCompetitions = competitions
        .slice(1) // Skip header row
        .filter(row => row[0] && row[2] !== 'TRUE'); // Skip empty rows and completed competitions

      if (activeCompetitions.length === 0) {
        await interaction.editReply({ content: '📊 No active competitions at the moment. Use `/createguessr` to start one!' });
        return;
      }

      // Get all guesses
      const guessesResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'guesses!A:C',
      });

      const allGuesses = guessesResponse.data.values || [];

      // Build the response message
      let message = '🎯 **Active ThronesGuessr Competitions**\n\n';

      for (const comp of activeCompetitions) {
        const competitionId = comp[0];
        const submittedDiscordUserId = comp[1];
        const question = comp[3];
        const priceIsRight = comp[4] === 'TRUE';
        const startNumber = comp[7] || 'N/A';

        // Check if user has guessed for this competition
        const userGuess = allGuesses.find(row => row[0] === competitionId && row[1] === discordUserId);
        const hasGuessed = userGuess ? '✅ You guessed' : '❌ Not guessed yet';
        const guessValue = userGuess ? userGuess[2] : null;

        // Fetch submitter's nickname
        let submitterName = 'Unknown User';
        try {
          const submitter = await interaction.guild.members.fetch(submittedDiscordUserId);
          submitterName = submitter.displayName;
        } catch (err) {
          console.error(`Failed to fetch member ${submittedDiscordUserId}:`, err);
        }

        message += `**Competition ID:** \`${competitionId}\`\n`;
        message += `**Created by:** ${submitterName}\n`;
        message += `**Question:** ${question}\n`;
        message += `**Start Number:** ${startNumber}\n`;
        if (priceIsRight) {
          message += `**Mode:** Price Is Right 📉\n`;
        }
        message += `**Status:** ${hasGuessed}\n`;
        if (guessValue !== null) {
          message += `**Your Guess:** ${guessValue}\n`;
        }
        message += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      }

      await interaction.editReply({ content: message });

    } catch (err) {
      console.error('Error fetching active competitions:', err);
      await interaction.deleteReply();
      await interaction.followUp({ content: 'Failed to fetch active competitions. Please try again.', ephemeral: true });
    }
  },
};
