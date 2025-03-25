import express from 'express';
import { getFormData, saveFormData} from '../controllers/googleSheetController';
import { getWhatsAppData } from '../controllers/googleSheetWhatsAppController';

const router = express.Router();

router.post('/saveUserGoogleSheet', saveFormData);//For saving the data to google sheets
router.get('/getUserGoogleSheet', getFormData);
router.get('/getUserGoogleSheetWhatsApp', getWhatsAppData);

export default router;