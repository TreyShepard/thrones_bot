const { fetchHiscores } = require('../utils/osrsApi');

const BOSSES = {
  "abyssal_sire": "Abyssal Sire",
  "alchemical_hydra": "Alchemical Hydra",
  "amoxliatl": "Amoxliatl",
  "araxxor": "Araxxor",
  "artio": "Artio",
  "barrows_chests": "Barrows Chests",
  "bryophyta": "Bryophyta",
  "callisto": "Callisto",
  "calvarion": "Calvar'ion",
  "cerberus": "Cerberus",
  "chambers_of_xeric": "Chambers of Xeric",
  "chambers_of_xeric_challenge_mode": "Chambers of Xeric (CM)",
  "chaos_elemental": "Chaos Elemental",
  "chaos_fanatic": "Chaos Fanatic",
  "commander_zilyana": "Commander Zilyana",
  "corporeal_beast": "Corporeal Beast",
  "crazy_archaeologist": "Crazy Archaeologist",
  "dagannoth_prime": "Dagannoth Prime",
  "dagannoth_rex": "Dagannoth Rex",
  "dagannoth_supreme": "Dagannoth Supreme",
  "deranged_archaeologist": "Deranged Archaeologist",
  "doom_of_mokhaiotl": "Doom of Mokhaiotl",
  "duke_sucellus": "Duke Sucellus",
  "general_graardor": "General Graardor",
  "giant_mole": "Giant Mole",
  "grotesque_guardians": "Grotesque Guardians",
  "hespori": "Hespori",
  "kalphite_queen": "Kalphite Queen",
  "king_black_dragon": "King Black Dragon",
  "kraken": "Kraken",
  "kree_arra": "Kree'arra",
  "kril_tsutsaroth": "K'ril Tsutsaroth",
  "lunar_chests": "Lunar Chests",
  "mimic": "Mimic",
  "nex": "Nex",
  "nightmare": "The Nightmare",
  "phosanis_nightmare": "Phosani's Nightmare",
  "obor": "Obor",
  "phantom_muspah": "Phantom Muspah",
  "sarachnis": "Sarachnis",
  "scorpia": "Scorpia",
  "scurrius": "Scurrius",
  "skotizo": "Skotizo",
  "sol_heredit": "Sol Heredit",
  "spindel": "Spindel",
  "tempoross": "Tempoross",
  "the_gauntlet": "The Gauntlet",
  "the_corrupted_gauntlet": "The Corrupted Gauntlet",
  "the_hueycoatl": "The Hueycoatl",
  "the_leviathan": "The Leviathan",
  "the_royal_titans": "The Royal Titans",
  "the_whisperer": "The Whisperer",
  "theatre_of_blood": "Theatre of Blood",
  "theatre_of_blood_hard_mode": "Theatre of Blood (Hard Mode)",
  "thermonuclear_smoke_devil": "Thermonuclear Smoke Devil",
  "tombs_of_amascut": "Tombs of Amascut",
  "tombs_of_amascut_expert": "Tombs of Amascut (Expert)",
  "tzkal_zuk": "TzKal-Zuk",
  "tztok_jad": "TzTok-Jad",
  "vardorvis": "Vardorvis",
  "venenatis": "Venenatis",
  "vetion": "Vet'ion",
  "vorkath": "Vorkath",
  "wintertodt": "Wintertodt",
  "yama": "Yama",
  "zalcano": "Zalcano",
  "zulrah": "Zulrah"
};

const OSRS_HISCORES_KEYS = [
  // Skills
  "overall", "attack", "defence", "strength", "hitpoints", "ranged", "prayer", "magic", "cooking", "woodcutting",
  "fletching", "fishing", "firemaking", "crafting", "smithing", "mining", "herblore", "agility", "thieving",
  "slayer", "farming", "runecraft", "hunter", "construction",
  // Minigames & Misc
  "league_points", "deadman_points", "bounty_hunter_hunter", "bounty_hunter_rogue",
  "bounty_hunter_legacy_hunter", "bounty_hunter_legacy_rogue",
  "clue_scrolls_all", "clue_scrolls_beginner", "clue_scrolls_easy", "clue_scrolls_medium", "clue_scrolls_hard",
  "clue_scrolls_elite", "clue_scrolls_master", "last_man_standing", "pvp_arena", "soul_wars_zeal", "rifts_closed",
  "colosseum_glory", "collections_logged",
  // Bosses (in order of API)
  "abyssal_sire", "alchemical_hydra", "amoxliatl", "araxxor", "artio", "barrows_chests", "bryophyta", "callisto",
  "calvarion", "cerberus", "chambers_of_xeric", "chambers_of_xeric_challenge_mode", "chaos_elemental", "chaos_fanatic",
  "commander_zilyana", "corporeal_beast", "crazy_archaeologist", "dagannoth_prime", "dagannoth_rex", "dagannoth_supreme",
  "deranged_archaeologist", "doom_of_mokhaiotl", "duke_sucellus", "general_graardor", "giant_mole", "grotesque_guardians",
  "hespori", "kalphite_queen", "king_black_dragon", "kraken", "kree_arra", "kril_tsutsaroth", "lunar_chests", "mimic",
  "nex", "nightmare", "phosanis_nightmare", "obor", "phantom_muspah", "sarachnis", "scorpia", "scurrius", "skotizo",
  "sol_heredit", "spindel", "tempoross", "the_gauntlet", "the_corrupted_gauntlet", "the_hueycoatl", "the_leviathan",
  "the_royal_titans", "the_whisperer", "theatre_of_blood", "theatre_of_blood_hard_mode", "thermonuclear_smoke_devil",
  "tombs_of_amascut", "tombs_of_amascut_expert", "tzkal_zuk", "tztok_jad", "vardorvis", "venenatis", "vetion",
  "vorkath", "wintertodt", "yama", "zalcano", "zulrah"
];

function parseHiscores(response) {
  const lines = response.trim().split('\n');
  const result = {};
  for (let i = 0; i < OSRS_HISCORES_KEYS.length && i < lines.length; i++) {
    const key = OSRS_HISCORES_KEYS[i];
    const values = lines[i].split(',');
    if (BOSSES[key] && values.length === 2) {
      result[key] = {
        rank: parseInt(values[0], 10),
        killcount: parseInt(values[1], 10)
      };
    }
  }
  return result;
}

module.exports = {
  name: 'killcount',
  description: "Get a player's killcount for a specific boss.",
  options: [
    {
      name: 'playername',
      description: "The player's RuneScape name",
      type: 3, // STRING
      required: true,
    },
    {
      name: 'bossname',
      description: 'The boss name (e.g. zulrah, vorkath, cerberus, etc.)',
      type: 3, // STRING
      required: true,
      choices: Object.entries(BOSSES).map(([key, value]) => ({
        name: value,
        value: key
      }))
    }
  ],
async execute(interaction) {
    const originalPlayerName = interaction.options.getString('playername');
    const bossInput = interaction.options.getString('bossname');

    // Normalize boss input: lowercase, remove spaces, apostrophes, hyphens, underscores
    const normalize = s => s.toLowerCase().replace(/[\s'’\-_.]/g, '');
    const normalizedBossInput = normalize(bossInput);

    // Find the boss key that matches the normalized input
    const bossKey = Object.keys(BOSSES).find(
      key => normalize(key) === normalizedBossInput || normalize(BOSSES[key]) === normalizedBossInput
    );

    if (!bossKey) {
      await interaction.reply({
        content: `Unknown boss. Available bosses: ${Object.values(BOSSES).join(', ')}`,
        ephemeral: true
      });
      return;
    }

    const playerName = originalPlayerName.replace(/ /g, '_');
    try {
      const response = await fetchHiscores(playerName);
      const hiscores = parseHiscores(response);
      const bossData = hiscores[bossKey];
      if (!bossData || bossData.killcount === -1) {
        await interaction.reply(`${originalPlayerName} has no recorded killcount for ${BOSSES[bossKey]}.`);
        return;
      }
      await interaction.reply(`${originalPlayerName}'s ${BOSSES[bossKey]} killcount: ${bossData.killcount}`);
    } catch (err) {
      await interaction.reply(`Error fetching hiscores for ${originalPlayerName}: ${err.message}`);
    }
  }
};