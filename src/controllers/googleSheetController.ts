import { google } from 'googleapis';
import { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

//Have to change when getting data via API
const newSpreadSheetId = process.env.SPREADSHEET_ID; //hardcoded for now
const newRange = process.env.SPREADSHEET_RANGE;

// Load credentials and authenticate
const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const saveFormData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, whatsappNumber, email, country, experience, queries } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName || !whatsappNumber || !email || !country || !experience) {
      res.status(400).send('All fields are required.');
      return; // Early exit without returning a value
    }

    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = newSpreadSheetId;

    // Append data to the sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A4', // Have to adjust the range as per the requirement
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

// Function to fetch data from Google Sheets
const getFormData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { spreadsheetId, range } = req.query;

    if (!spreadsheetId || !range) {
      res.status(400).json({ error: 'Missing required parameters: spreadsheetId or range' });
      return;
    }

    const client = (await auth.getClient()) as any;
    const sheets = google.sheets({ version: 'v4', auth: client });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: newSpreadSheetId,
      // spreadsheetId: spreadsheetId as string, //For future reference to get via API
      range: newRange, // Example: 'Sheet1!A1:D10'
      // range: range as string, // Example: 'Sheet1!A1:D10' //For future reference to get via API
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      res.status(404).json({ message: 'No data found.' });
      return;
    }

    res.json({ data: rows });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export { saveFormData, getFormData};
