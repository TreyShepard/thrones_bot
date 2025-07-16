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

## License

MIT
