const { getSheetsClient } = require('../../utils/googleSheets');

function normalizeHeader(value) {
  return String(value || '').trim().toLowerCase();
}

function getTabTitle(sheetData, expectedTitle) {
  const titles = (sheetData.sheets || [])
    .map(sheet => sheet.properties && sheet.properties.title)
    .filter(Boolean);
  const title = titles.find(candidate => normalizeHeader(candidate) === expectedTitle.toLowerCase());
  if (!title) {
    throw new Error(`Spreadsheet is missing the ${expectedTitle} tab. Available tabs: ${titles.join(', ') || '(none)'}`);
  }
  return title;
}

function quoteTabTitle(title) {
  return `'${title.replace(/'/g, "''")}'`;
}

function parseBoolean(value, label) {
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized === 'true') return true;
  if (normalized === 'false' || normalized === '') return false;
  throw new Error(`Invalid boolean value for ${label}: ${value}`);
}

function getColumnIndexes(headerRow, requiredHeaders, tabName) {
  const indexes = new Map(headerRow.map((header, index) => [normalizeHeader(header), index]));
  const missing = requiredHeaders.filter(header => !indexes.has(header.toLowerCase()));
  if (missing.length) {
    throw new Error(`${tabName} tab is missing required column(s): ${missing.join(', ')}`);
  }
  return indexes;
}

async function getPursuitState() {
  const spreadsheetId = process.env.P4L_GOOGLE_SHEET_ID;
  if (!spreadsheetId) throw new Error('P4L_GOOGLE_SHEET_ID is not set in the environment.');

  const sheets = await getSheetsClient();
  const spreadsheetResponse = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: 'sheets.properties.title',
  });
  const settingsTab = getTabTitle(spreadsheetResponse.data, 'Settings');
  const itemsTab = getTabTitle(spreadsheetResponse.data, 'Items');
  const settingsResponse = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${quoteTabTitle(settingsTab)}!A1:B`,
  });
  const settingsRows = settingsResponse.data.values || [];
  if (!settingsRows.length) throw new Error('Settings tab is empty or unavailable.');

  const settingsColumns = getColumnIndexes(settingsRows[0], ['Setting', 'Status'], 'Settings');
  const activeSetting = settingsRows.slice(1).find(row =>
    String(row[settingsColumns.get('setting')] || '').trim().toLowerCase() === 'active'
  );
  if (!activeSetting) throw new Error('Settings tab does not contain an Active setting.');

  const active = parseBoolean(activeSetting[settingsColumns.get('status')], 'Settings.Active');
  if (!active) return { active: false };

  const itemsResponse = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${quoteTabTitle(itemsTab)}!A1:E`,
  });
  const itemRows = itemsResponse.data.values || [];
  if (!itemRows.length) throw new Error('Items tab is empty or unavailable.');

  const itemColumns = getColumnIndexes(
    itemRows[0],
    ['ItemName', 'Availability', 'IsActive', 'IsGeneric', 'WikiLink'],
    'Items'
  );
  const items = itemRows.slice(1).map((row, index) => ({
    name: String(row[itemColumns.get('itemname')] || '').trim(),
    available: parseBoolean(row[itemColumns.get('availability')], `Items row ${index + 2} Availability`),
    isActive: parseBoolean(row[itemColumns.get('isactive')], `Items row ${index + 2} IsActive`),
    isGeneric: parseBoolean(row[itemColumns.get('isgeneric')], `Items row ${index + 2} IsGeneric`),
    wikiLink: String(row[itemColumns.get('wikilink')] || '').trim(),
    rowNumber: index + 2,
  })).filter(item => item.name);

  for (const item of items) {
    if (item.isGeneric && !item.wikiLink) {
      throw new Error(`Items row ${item.rowNumber} is generic but has no WikiLink.`);
    }
  }

  return { active: true, sheets, spreadsheetId, itemsTab, items };
}

async function updateItemStates(sheets, spreadsheetId, itemsTab, changes) {
  const quotedItemsTab = quoteTabTitle(itemsTab);
  const data = [];
  for (const change of changes) {
    if (change.available !== undefined) {
      data.push({ range: `${quotedItemsTab}!B${change.rowNumber}`, values: [[change.available ? 'TRUE' : 'FALSE']] });
    }
    if (change.isActive !== undefined) {
      data.push({ range: `${quotedItemsTab}!C${change.rowNumber}`, values: [[change.isActive ? 'TRUE' : 'FALSE']] });
    }
  }

  if (!data.length) return;
  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId,
    requestBody: { valueInputOption: 'RAW', data },
  });
}

module.exports = { getPursuitState, updateItemStates };