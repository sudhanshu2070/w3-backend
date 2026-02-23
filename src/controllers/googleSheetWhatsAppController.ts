import { google } from 'googleapis';
import { Request, Response } from 'express';
import { JWT } from 'google-auth-library';
import dotenv from 'dotenv';

// Loading environment variables from .env file
dotenv.config();

// Extracting environment variables for spreadsheet ID and range
const SPREADSHEET_ID = process.env.WHATSAPP_SPREADSHEET_ID;

if (!SPREADSHEET_ID) {
  console.error('Missing WHATSAPP_SPREADSHEET_ID in .env file');
  process.exit(1); // Exit the process
}

// Decode the Base64-encoded JSON string
const base64Credentials =
  process.env.GOOGLE_APPLICATION_CREDENTIALS_WHATSAPP_BASE64 || '';
const credentialsJson = Buffer.from(base64Credentials, 'base64').toString(
  'utf-8',
);

// Parse the JSON string into an object
const credentials = JSON.parse(credentialsJson || '{}');

// Initialize Google Auth with credentials and required scopes
const googleAuth = new google.auth.GoogleAuth({
  // keyFile: 'credentials-whatsApp.json', // Path to Google Sheets API credentials file(for local testing)
  credentials, // Use the parsed credentials object
  scopes: ['https://www.googleapis.com/auth/spreadsheets'], // Scope for accessing Google Sheets
});

/**
 * Fetches data from a Google Sheet using the provided spreadsheet ID and range.
 *
 * @param {Request} req - Express request object containing query parameters (spreadsheetId, range).
 * @param {Response} res - Express response object to send back the fetched data or error message.
 */
const fetchWhatsAppData = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Extracting query parameters from the request
    const { range } = req.query;

    // Validating that both `spreadsheetId` and `range` are provided
    if (!range) {
      res.status(400).json({ error: 'Missing required parameters: range' });
      return;
    }

    // Authenticating with Google Sheets API
    const authClient = (await googleAuth.getClient()) as JWT;
    const sheetsAPI = google.sheets({ version: 'v4', auth: authClient });

    const sheetResponse = await sheetsAPI.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: range as string,
    });

    // Extract rows from the response
    const sheetRows = sheetResponse.data.values;

    if (!sheetRows || sheetRows.length === 0) {
      res
        .status(404)
        .json({ message: 'No data found in the specified range.' });
      return;
    }

    // Sending the fetched data as JSON response
    res.json({ data: sheetRows });
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    res.status(500).json({
      error: 'An internal server error occurred while fetching data.',
    });
  }
};

export { fetchWhatsAppData };
