import { google } from 'googleapis';
import { Request, Response } from 'express';
import { JWT } from 'google-auth-library';

import dotenv from 'dotenv';

dotenv.config();

const fs = require("fs");

// Load credentials and authenticate
const auth = new google.auth.GoogleAuth({
    // keyFile: "credentials.json",
    keyFile: credentialsPath, // Using the temporary path
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Function to fetch data from Google Sheets for WhatsApp
const getWhatsAppData = async (req: Request, res: Response): Promise<void> => {
    try {
      const { spreadsheetId, range } = req.query;
  
      if (!spreadsheetId || !range) {
        res.status(400).json({ error: 'Missing required parameters: spreadsheetId or range' });
        return;
      }
  
      const client = (await auth.getClient()) as JWT;
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
  
export {getWhatsAppData};  