import express from 'express';
import { saveFormData } from '../controllers/googleSheetController';

const router = express.Router();

router.post('/save-to-google-sheets', saveFormData);//For saving the data to google sheets

export default router;