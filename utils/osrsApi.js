
async function fetchHiscores(playerName) {
  const formattedName = playerName.replace(/ /g, '_');
  const baseUrl = 'https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws';
  const url = `${baseUrl}?player=${encodeURIComponent(formattedName)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch hiscores');
  return await response.text(); // <-- Return the raw CSV string
}

module.exports = { fetchHiscores };