import express from 'express';
import { saveFormData} from '../controllers/googleSheetController';
import { getFormData } from '../controllers/googleSheetController';

const router = express.Router();

router.post('/saveUserGoogleSheet', saveFormData);//For saving the data to google sheets
router.get('/getUserGoogleSheet', getFormData);
router.get('/getUserGoogleSheetWhatsApp', getFormData);

export default router;