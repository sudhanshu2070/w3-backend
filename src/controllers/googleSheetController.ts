import { google } from 'googleapis';
import { Request, Response } from 'express';

const saveFormData = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, whatsappNumber, email, country, experience, queries } = req.body;

    if (!firstName || !lastName || !whatsappNumber || !email || !country || !experience) {
      return res.status(400).send('All fields are required.');
    }

    // Load credentials and authenticate
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = process.env.SPREADSHEET_ID;

    // Append data to the sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A1', // Adjust the range as needed
      valueInputOption: 'RAW',
      requestBody: {
        values: [[firstName, lastName, whatsappNumber, email, country, experience, queries]],
      },
    });

    res.status(200).send('Data saved successfully!');
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    res.status(500).send('Internal Server Error');
  }
};

export { saveFormData };