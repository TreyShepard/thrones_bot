const { getSheetsClient } = require('../utils/googleSheets');

module.exports = {
  name: 'guessrleaderboard',
  description: 'Display the top 3 ThronesGuessr winners.',

  async execute(interaction) {
    await interaction.deferReply();

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
      // Get all members
      const membersResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'members!A:B',
      });

      const members = membersResponse.data.values || [];

      if (members.length === 0) {
        await interaction.editReply({ content: '📊 No members found in the leaderboard yet!' });
        return;
      }

      // Parse and sort members by wins
      const memberData = members.map(row => ({
        discordUserId: row[0],
        wins: parseInt(row[1] || '0'),
      })).filter(m => m.wins > 0); // Only show members with at least 1 win

      // Sort by wins descending
      memberData.sort((a, b) => b.wins - a.wins);

      // Get top 3
      const top3 = memberData.slice(0, 3);

      if (top3.length === 0) {
        await interaction.editReply({ content: '📊 No winners yet! Be the first to win a ThronesGuessr competition!' });
        return;
      }

      // Build leaderboard message
      let leaderboardMessage = '🏆 **ThronesGuessr Leaderboard - Top 3**\n\n';

      const medals = ['🥇', '🥈', '🥉'];

      for (let i = 0; i < top3.length; i++) {
        const member = top3[i];
        try {
          const discordMember = await interaction.guild.members.fetch(member.discordUserId);
          const medal = medals[i] || `${i + 1}.`;
          leaderboardMessage += `${medal} **${discordMember.displayName}** - ${member.wins} win${member.wins !== 1 ? 's' : ''}\n`;
        } catch (err) {
          console.error(`Failed to fetch member ${member.discordUserId}:`, err);
          const medal = medals[i] || `${i + 1}.`;
          leaderboardMessage += `${medal} *Unknown User* - ${member.wins} win${member.wins !== 1 ? 's' : ''}\n`;
        }
      }

      await interaction.editReply({ content: leaderboardMessage });

    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      await interaction.deleteReply();
      await interaction.followUp({ content: 'Failed to fetch the leaderboard. Please try again.', ephemeral: true });
    }
  },
};
