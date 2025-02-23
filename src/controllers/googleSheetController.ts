import { google } from 'googleapis';
import { Request, Response } from 'express';

const saveFormData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, whatsappNumber, email, country, experience, queries } = req.body;

    console.log('Request body:', req.body); 
    
    // Validate required fields
    if (!firstName || !lastName || !whatsappNumber || !email || !country || !experience) {
      res.status(400).send('All fields are required.');
      return; // Early exit without returning a value
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

    // Send success response
    res.status(200).send('Data saved successfully!');
    // No explicit return here
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    res.status(500).send('Internal Server Error');
    // No explicit return here
  }
};

export { saveFormData };