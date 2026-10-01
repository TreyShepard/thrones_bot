const { EmbedBuilder } = require('discord.js');

const WIKI_API_URL = 'https://oldschool.runescape.wiki/api.php';
const WIKI_PAGE_URL = 'https://oldschool.runescape.wiki/w/';
const GOLD = 0xd5a62a;

async function getWikiItemDetails(itemName) {
  const itemTitle = String(itemName || '').trim();
  if (!itemTitle) return { pageUrl: WIKI_PAGE_URL, imageUrl: null };
  const title = `${itemTitle[0].toUpperCase()}${itemTitle.slice(1).toLowerCase()}`.replace(/\s+/g, '_');
  const pageUrl = `${WIKI_PAGE_URL}${encodeURIComponent(title)}`;

  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    prop: 'pageimages',
    piprop: 'thumbnail',
    pithumbsize: '256',
    titles: title,
  });

  try {
    const response = await fetch(`${WIKI_API_URL}?${params}`, {
      headers: { 'User-Agent': 'ThronesBot/1.0 (Pursuit for Loot Discord bot)' },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error(`Wiki API returned HTTP ${response.status}`);

    const data = await response.json();
    const page = Object.values(data.query?.pages || {})[0];
    return { pageUrl, imageUrl: page?.thumbnail?.source || null };
  } catch (error) {
    console.warn(`Could not fetch OSRS Wiki image for ${itemName}:`, error.message);
    return { pageUrl, imageUrl: null };
  }
}

async function getItemWikiDetails(item) {
  if (item.isGeneric) return { pageUrl: item.wikiLink, imageUrl: null };
  return getWikiItemDetails(item.name);
}

async function createStartAnnouncement(item) {
  const wiki = await getItemWikiDetails(item);
  const embed = new EmbedBuilder()
    .setColor(GOLD)
    .setTitle('Pursuit for Loot')
    .setURL(wiki.pageUrl)
    .setDescription(`The hunt is on. The current target is **[${item.name}](${wiki.pageUrl})**.`)
    .setFooter({ text: 'A new pursuit begins' });

  if (wiki.imageUrl) embed.setThumbnail(wiki.imageUrl);
  return { embeds: [embed] };
}

async function createCrownAnnouncement(winnerId, completedItem, alreadyCrownHolder = false) {
  const completedWiki = await getItemWikiDetails(completedItem);
  const embed = new EmbedBuilder()
    .setColor(GOLD)
    .setTitle(alreadyCrownHolder ? 'The Crown Remains' : 'The Crown Has Changed Hands')
    .setURL(completedWiki.pageUrl)
    .setDescription(alreadyCrownHolder
      ? `**[${completedItem.name}](${completedWiki.pageUrl})** has been claimed. <@${winnerId}> still holds the crown.`
      : `**[${completedItem.name}](${completedWiki.pageUrl})** has been claimed. The crown now belongs to <@${winnerId}>.`)
    .setFooter({ text: 'Pursuit for Loot' });

  if (completedWiki.imageUrl) embed.setThumbnail(completedWiki.imageUrl);

  return {
    content: alreadyCrownHolder
      ? `👑 <@${winnerId}> obtained **${completedItem.name}** and still holds the crown!`
      : `👑 <@${winnerId}> obtained **${completedItem.name}** and now holds the crown!`,
    embeds: [embed],
    allowedMentions: { users: [winnerId] },
  };
}

async function createNextItemAnnouncement(item) {
  const wiki = await getItemWikiDetails(item);
  const embed = new EmbedBuilder()
    .setColor(GOLD)
    .setTitle('A New Pursuit Begins')
    .setURL(wiki.pageUrl)
    .setDescription(`The next target is **[${item.name}](${wiki.pageUrl})**.`)
    .setFooter({ text: 'Pursuit for Loot' });

  if (wiki.imageUrl) embed.setThumbnail(wiki.imageUrl);
  return { embeds: [embed] };
}

function createPursuitCompleteAnnouncement() {
  const embed = new EmbedBuilder()
    .setColor(GOLD)
    .setTitle('Pursuit Complete')
    .setDescription('There are no available items remaining.');
  return { embeds: [embed] };
}

module.exports = {
  createStartAnnouncement,
  createCrownAnnouncement,
  createNextItemAnnouncement,
  createPursuitCompleteAnnouncement,
};