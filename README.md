# Thrones Discord Bot

A custom Discord bot built using `discord.js` to support clan management, event tracking, and onboarding automation.

## Features

- `.ping` command (basic health check)
- Modular command + event structure
- Onboarding support (planned)
- Role assignment (planned)
- Supports `.env`-based config

## Project Structure

discord-bot/
 ─ commands/             - Individual commands (e.g., .ping, .bingo)
 ─ events/               - Discord event handlers (e.g., user join, message)
 ─ data/                 - Static content like calendar, history, etc.
 ─ .env                  - Token config (not committed to repo)
 ─ index.js              - Entry point and wiring logic

## Getting Started

1. Clone the repository on server

   git clone https://github.com/TreyShepard/thrones-bot.git
   cd thrones-bot

2. Install dependencies

   npm install

3. Create a .env file in the root

   DISCORD_TOKEN=your-bot-token-here

4. Start the bot

   npm start

## Pursuit for Loot Setup

The bot uses the Google Sheets API service account configured by `GOOGLE_CLIENT_EMAIL` and `GOOGLE_PRIVATE_KEY` in `.env`. Enable the Google Sheets API in the Google Cloud project that owns the service account, then share the spreadsheet with the service-account email and grant Editor access. The service account must be able to read and edit the `Settings` and `Items` tabs.

Set `P4L_GOOGLE_SHEET_ID` to the Pursuit for Loot spreadsheet ID, `P4L_INFORMATION_CHANNEL_ID` to the channel where the active item should be announced, and `P4L_SUBMISSIONS_CHANNEL_ID` to the channel where proof screenshots should be posted. The existing `GOOGLE_SHEET_ID` remains available for other bot features.

The bot needs `View Channel` and `Send Messages` permissions in both configured channels.

Pursuit announcements link item names to their OSRS Wiki pages and request thumbnails through the Wiki's MediaWiki `pageimages` API. If the API has no thumbnail or is unavailable, the announcement still includes the item page link.

The `Settings` tab needs `Setting` and `Status` columns with an `Active` row. The `Items` tab needs `ItemName`, `Availability`, and `IsActive` columns. Use `TRUE` or `FALSE` for the two status columns.

Run `node deploy-commands.js` after adding or changing the slash commands, then restart the bot.

## Adding the Bot to Your Server

1. Go to https://discord.com/developers/applications
2. Select your application
3. Navigate to "OAuth2" > "URL Generator"
4. Under scopes, check:
   - bot
   - applications.commands
5. Under permissions, select:
   - Send Messages
   - Read Message History
   - Manage Roles (if needed)
6. Use the generated URL to invite the bot to your server

## Basic Test

Send the following in a text channel the bot can read:

   .ping

The bot should reply with:

   Pong!

## Next Steps

- Add commands to `commands/`
- Add logic to `events/` for onboarding and reactions to discord activity
- Store static clan info in `data/`
 - This partition could easily be an efs system in future state.

## License

MIT
