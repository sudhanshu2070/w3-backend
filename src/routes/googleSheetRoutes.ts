import express from 'express';
import { getFormData, getWhatsAppData, saveFormData} from '../controllers/googleSheetController';

const router = express.Router();

router.post('/saveUserGoogleSheet', saveFormData);//For saving the data to google sheets
router.get('/getUserGoogleSheet', getFormData);
router.get('/getUserGoogleSheetWhatsApp', getWhatsAppData);

export default router;