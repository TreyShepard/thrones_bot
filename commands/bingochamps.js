// Thrones VI Bingo Standings Command
// Command: !bingochamps [info|all]
// - No args: Summary of team standings with emojis
// - "info": Link to tracking sheet
// - "all": Full details of each team and members
const teams = [
  {
    name: "Winkelburglers",
    total: 211,
    members: [
      { name: "mhe00", points: 30.5 },
      { name: "NotRetro", points: 20.9 },
      { name: "Shindo main/shindoryu", points: 16 },
      { name: "Giga Goober", points: 15.7 },
      { name: "FucTurtles", points: 14 },
      { name: "Winkelburge3", points: 13.2 },
      { name: "M U M B I/Lil numbs", points: 13 },
      { name: "Caring", points: 12.7 },
      { name: "Freezy", points: 11 },
      { name: "Kaosdj2", points: 7.2 },
      { name: "Mago_0308", points: 6 },
      { name: "Sneak", points: 2.3 },
      { name: "Abitwent Tin", points: 0.3 },
      { name: "Bringvasline", points: 0 },
    ],
  },
  {
    name: "Konars Crevice",
    total: 231,
    members: [
      { name: "Forgotmystam", points: 31 },
      { name: "Slizzle", points: 25.2 },
      { name: "Rancie", points: 18.2 },
      { name: "Set h", points: 16 },
      { name: "UncleTevis", points: 15.2 },
      { name: "King Tut 16", points: 13.5 },
      { name: "Bingo HR", points: 11 },
      { name: "EvaZlioN", points: 10.6 },
      { name: "Bacodie", points: 10.2 },
      { name: "Blu Ocean", points: 10.1 },
      { name: "Rex Soloman", points: 10 },
      { name: "Forgotten", points: 6 },
      { name: "Lil Myth Myth", points: 3 },
      { name: "Rupea", points: 3 },
    ],
  },
  {
    name: "Blombussies",
    total: 123.5,
    members: [
      { name: "Don Ratrero", points: 21.6 },
      { name: "Blizz", points: 10.1 },
      { name: "Blombo", points: 10.1 },
      { name: "Wise Ope", points: 10 },
      { name: "Smartkoolaid", points: 10 },
      { name: "Detrovi Sr", points: 8.5 },
      { name: "lePijon/Lil Pij", points: 8.5 },
      { name: "Asamba", points: 8.3 },
      { name: "naiG", points: 7 },
      { name: "lil bit gay", points: 3.5 },
      { name: "jar expert", points: 2.5 },
      { name: "YO0 Jake", points: 2.5 },
      { name: "Energy Bolt", points: 1.3 },
      { name: "Darktyranno", points: 3 }
    ],
  },
  {
    name: "PB Gang",
    total: 168,
    members: [
      { name: "GiM Pionero", points: 22.6 },
      { name: "ElIronJota", points: 21.5 },
      { name: "Tz-Tok-Evil", points: 21.2 },
      { name: "topzishere", points: 19.5 },
      { name: "JSSchonberg", points: 15 },
      { name: "skibiron", points: 12 },
      { name: "Chawn", points: 8 },
      { name: "Clear it", points: 5.7 },
      { name: "Taercy", points: 5 },
      { name: "Gazpa", points: 4.3 },
      { name: "RatGirlRemi", points: 3 },
      { name: "Finding Dory", points: 2 },
      { name: "LaVacaleech", points: 1 },
      { name: "Zero Lootz", points: 0 },
      { name: "Zastrien", points: 0 },
    ],
  },
];

module.exports = {
  name: "bingochamps",
  description: "Displays Thrones VII Bingo results.",
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
    const userId = interaction.user.id;

    if (mode === "info") {
      // Info argument: return the tracking sheet URL
      await interaction.reply(
        "Thrones 6 Bingo Tracking Sheet: https://docs.google.com/spreadsheets/d/1AnBYOhfsACDoJLdUzYsH8sbcyq39J1i9ac4zIedH0hs"
      );
      return;
    }

    if (mode === "all") {
      // Full details: send each team as a separate message
      const sorted = [...teams].sort((a, b) => b.total - a.total);
      await interaction.reply("**Thrones VII Bingo - Full Standings**");
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
    let reply = `**Thrones VII Bingo - Team Standings**\n\n`;
    const sorted = [...teams].sort((a, b) => b.total - a.total);
    sorted.forEach((team, idx) => {
      const medal = medals[idx] || "🏅";
      reply += `${medal} __**${team.name}**__: **${team.total} pts**\n`;
    });
    await interaction.reply(reply);
  },
};

