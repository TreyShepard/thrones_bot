// Thrones V Bingo Standings Command
// Command: !bingochamps [info|all]
// - No args: Summary of team standings with emojis
// - "info": Link to tracking sheet
// - "all": Full details of each team and members
const teams = [
  {
    name: "Cox Enjoyers",
    total: 147,
    members: [
      { name: "Fordham", points: 17.7 },
      { name: "Kaosdj2", points: 15.8 },
      { name: "Papalotee", points: 10.9 },
      { name: "An brew", points: 10.3 },
      { name: "bacodie jr", points: 8.5 },
      { name: "Rex Soloman", points: 8.5 },
      { name: "Giga Goober", points: 6.8 },
      { name: "H u m b i", points: 6.6 },
      { name: "DumplingsDad", points: 6.0 },
      { name: "Sneak/ Old Habibi", points: 6.0 },
      { name: "EvaZiioN", points: 4.8 },
      { name: "Wise Ope", points: 4.3 },
      { name: "SlowlyKillMe", points: 4.3 },
      { name: "Bringvasline", points: 2.3 },
      { name: "Caitlin Rice/Koomar", points: 2.3 },
    ],
  },
  {
    name: "Pharaohs of the North",
    total: 117,
    members: [
      { name: "Shindo Main / Shindoryu", points: 20.4 },
      { name: "King Tut 16", points: 15.4 },
      { name: "NotRetro", points: 11.3 },
      { name: "SirAnduin", points: 9.0 },
      { name: "Energy Bolt/ EnergyBolter", points: 8.5 },
      { name: "Caring / Creating", points: 7.0 },
      { name: "zero lootz", points: 4.3 },
      { name: "Skibiron", points: 3.5 },
      { name: "Blom (prep)", points: 2.0 },
      { name: "Skullznbones", points: 2.0 },
      { name: "Zastrien", points: 1.0 },
      { name: "Mebigbob", points: 1.0 },
      { name: "AthenianMain", points: 0.3 },
      { name: "yadrans", points: 0.0 },
      { name: "Avg Rev", points: 0.0 },
      { name: "Finding Dory", points: 0.0 },
    ],
  },
  {
    name: "The Wailords",
    total: 112,
    members: [
      { name: "slizzle", points: 12.2 },
      { name: "F r e e z y/Im Freezy", points: 12.0 },
      { name: "Detrovi Sr", points: 10.7 },
      { name: "Jar Expert / SIGNZ", points: 10.0 },
      { name: "Forgotten", points: 6.5 },
      { name: "Winkelburge2", points: 6.5 },
      { name: "topzishere/ old topz", points: 6.0 },
      { name: "Asamba", points: 6.0 },
      { name: "Rupea", points: 4.8 },
      { name: "Clear it", points: 3.5 },
      { name: "Next Lucifer", points: 3.2 },
      { name: "smartkoolaid", points: 3.0 },
      { name: "naiG", points: 2.5 },
      { name: "Kadz rs", points: 1.3 },
      { name: "Voided Fate", points: 1.3 },
      { name: "DallyBruh", points: 0.0 },
    ],
  },
  {
    name: "D.A.R.E. Devils",
    total: 74,
    members: [
      { name: "C h a w n y and C h a w n", points: 10.0 },
      { name: "Mhe00", points: 8.5 },
      { name: "ForgotmyStam", points: 8.3 },
      { name: "Hansi Kursch", points: 8.2 },
      { name: "Darktyranno", points: 6.3 },
      { name: "Lil Sym", points: 6.3 },
      { name: "TevisCrevice", points: 5.0 },
      { name: "lePijon", points: 4.7 },
      { name: "Lil Myth/Lilr Myth", points: 3.7 },
      { name: "MajesticOrca", points: 2.9 },
      { name: "rockdaddy96", points: 1.5 },
      { name: "Blizz", points: 1.3 },
      { name: "Taercy/ Boochoo Leaf", points: 1.0 },
      { name: "KingWhiskle", points: 1.0 },
      { name: "FucTurtles", points: 0.0 },
      { name: "", points: 0.0 },
    ],
  },
];

module.exports = {
  name: "bingochamps",
  description: "Displays Thrones V Bingo results.",
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
  async execute(interaction) {
    const medals = ["🥇", "🥈", "🥉", "🏅"];
    const mode = interaction.options.getString('mode');
    const username = interaction.user.username;

    // Special case for Papalotee
    if (username === 'papalote4465') {
      await interaction.reply("What a surprise, Papalotee tried the bingochamps command. He sees a bingo tile, complains, then goes there and spoons it. That fker.");
      return;
    }

    if (mode === "info") {
      // Info argument: return the tracking sheet URL
      await interaction.reply(
        "Thrones V Bingo Tracking Sheet: https://docs.google.com/spreadsheets/d/11GBW5wqrjMHB9s0rW-FbHXuP0gdXVZZLj8jv89wCg88"
      );
      return;
    }

    if (mode === "all") {
      // Full details: send each team as a separate message
      const sorted = [...teams].sort((a, b) => b.total - a.total);
      await interaction.reply("**Thrones V Bingo - Full Standings**");
      for (let idx = 0; idx < sorted.length; idx++) {
        const team = sorted[idx];
        const medal = medals[idx] || "🏅";
        let reply = `${medal} __**${team.name}**__  \`(${team.total} pts)\`\n`;
        reply += "```";
        team.members
          .filter(m => m.name)
          .forEach(m => {
            reply += `${m.name.padEnd(25)} ${m.points}\n`;
          });
        reply += "```";
        await interaction.followUp(reply);
      }
      return;
    }

    // Summary with Markdown and emojis
    let reply = `**Thrones V Bingo - Team Standings**\n\n`;
    const sorted = [...teams].sort((a, b) => b.total - a.total);
    sorted.forEach((team, idx) => {
      const medal = medals[idx] || "🏅";
      reply += `${medal} __**${team.name}**__: **${team.total} pts**\n`;
    });
    await interaction.reply(reply);
  },
};

