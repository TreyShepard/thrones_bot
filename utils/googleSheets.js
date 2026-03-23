const { google } = require('googleapis');

async function getSheetsClient() {
  const apiKey = process.env.API_KEY || process.env.GOOGLE_API_KEY;
  if (apiKey) {
    // API key auth (works for public sheets or read-only in some cases)
    return google.sheets({ version: 'v4', auth: apiKey });
  }

  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (clientEmail && privateKey) {
    // Restore escaped newlines in private key if necessary
    privateKey = privateKey.replace(/\\n/g, '\n');

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const authClient = await auth.getClient();
    return google.sheets({ version: 'v4', auth: authClient });
  }

  throw new Error(
    'No Google Sheets credentials found. Set API_KEY or GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY in environment.'
  );
}

module.exports = { getSheetsClient };
