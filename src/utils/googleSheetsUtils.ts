import { google } from 'googleapis';

export const appendToSheet = async (data: string[]) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4' });
  sheets.context._options.auth = client as any;

  const spreadsheetId = process.env.SPREADSHEET_ID;

  await sheets.spreadsheets.values.append({
    spreadsheetId: spreadsheetId!,
    range: 'Sheet1!A1',
    valueInputOption: 'RAW',
    requestBody: {
      values: [data],
    },
  });
};
