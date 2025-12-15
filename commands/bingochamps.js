// Thrones VI Bingo Standings Command
// Command: !bingochamps [info|all]
// - No args: Summary of team standings with emojis
// - "info": Link to tracking sheet
// - "all": Full details of each team and members
const teams = [
  {
    name: "Gum Drop Addicts",
    total: 253.0,
    members: [
      { name: "Ratrero", points: 44.9 },
      { name: "mhe00", points: 36.5 },
      { name: "Blizz", points: 20.5 },
      { name: "lePijon / Lil Pij", points: 19.9 },
      { name: "Forgotten", points: 17.7 },
      { name: "Rupea", points: 15.8 },
      { name: "Bringvasline", points: 14.5 },
      { name: "Caring / Creating", points: 13.6 },
      { name: "rockdaddy96", points: 12.5 },
      { name: "Detrovi Sr", points: 10.3 },
      { name: "Hansi Kursch", points: 4.4 },
      { name: "DumbKoolaid", points: 0.4 },
    ],
  },
  {
    name: "Reinbeers",
    total: 226.0,
    members: [
      { name: "Shindo main/ shindoryu", points: 38.0 },
      { name: "bacoudi", points: 31.2 },
      { name: "lil bit gay", points: 20.4 },
      { name: "Clear it", points: 19.4 },
      { name: "Rancie", points: 17.4 },
      { name: "Asamba", points: 15.0 },
      { name: "finding dory", points: 11.4 },
      { name: "Sneak", points: 10.5 },
      { name: "Boujee Tamer", points: 10.0 },
      { name: "Chawnee", points: 6.0 },
      { name: "EvaZiioN", points: 5.7 },
      { name: "Koomar / Caitlin Rice", points: 3.0 },
      { name: "Yadrans", points: 0.0 },
    ],
  },
  {
    name: "Double Stuffed",
    total: 168.5,
    members: [
      { name: "Papalotee", points: 27.5 },
      { name: "ThePionero", points: 26.8 },
      { name: "GIga Goober/Jiji Scrubs", points: 25.8 },
      { name: "Kaosdj2", points: 25.0 },
      { name: "Pretty Lost", points: 18.0 },
      { name: "ElIronJota", points: 12.3 },
      { name: "naiG", points: 6.5 },
      { name: "Gazpa", points: 4.7 },
      { name: "Mebigbob", points: 3.3 },
      { name: "LaVacaLeech", points: 1.5 },
      { name: "Rex Soloman", points: 0.0 },
      { name: "Next Lucifer", points: 0.0 },
      { name: "Chew", points: 0.0 },
    ],
  },
  {
    name: "Boats and ho-ho-hos",
    total: 172.0,
    members: [
      { name: "blu ocean", points: 32.4 },
      { name: "Slizzle", points: 23.5 },
      { name: "Winkelburge2", points: 12.6 },
      { name: "Ru Ez", points: 11.7 },
      { name: "Freezy", points: 11.3 },
      { name: "Insulinfein", points: 10.0 },
      { name: "jar expert", points: 9.7 },
      { name: "Behka", points: 8.4 },
      { name: "Wise Ope", points: 8.0 },
      { name: "Energy Bolt", points: 7.4 },
      { name: "M u m b i", points: 6.4 },
      { name: "wheei chair", points: 4.3 },
    ],
  },
  {
    name: "Whorcas",
    total: 140.3,
    members: [
      { name: "Forgotmystam", points: 18.5 },
      { name: "Avg Rev", points: 17.0 },
      { name: "Darktyranno & BroIsThatU", points: 16.0 },
      { name: "TevisCrevice", points: 11.5 },
      { name: "Blombo", points: 11.4 },
      { name: "Taercy", points: 10.4 },
      { name: "King Tut 16", points: 9.7 },
      { name: "Fordham", points: 9.0 },
      { name: "MajesticOrca", points: 8.0 },
      { name: "topzishere", points: 6.7 },
      { name: "LunastusFE", points: 5.0 },
      { name: "Zastrien", points: 4.0 },
      { name: "Lil Myth", points: 0.0 },
    ],
  },
];

module.exports = {
  name: "bingochamps",
  description: "Displays Thrones VI Bingo results.",
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
        "Thrones 6 Bingo Tracking Sheet: https://docs.google.com/spreadsheets/d/1QuySPR9U3u4YfxnYOZF_37CPsn4F3O-vw3OiCGC-qZU"
      );
      return;
    }

    if (mode === "all") {
      // Full details: send each team as a separate message
      const sorted = [...teams].sort((a, b) => b.total - a.total);
      await interaction.reply("**Thrones VI Bingo - Full Standings**");
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
    let reply = `**Thrones VI Bingo - Team Standings**\n\n`;
    const sorted = [...teams].sort((a, b) => b.total - a.total);
    sorted.forEach((team, idx) => {
      const medal = medals[idx] || "🏅";
      reply += `${medal} __**${team.name}**__: **${team.total} pts**\n`;
    });
    await interaction.reply(reply);
  },
};

