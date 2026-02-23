import { Router } from 'express';
import {
  loginUser,
  logoutUser,
  verifyToken,
} from '../controllers/userAuthController';
import { verifyUser } from '../middleware/userAuthMiddleware';

const router = Router();

router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/verify', verifyUser, verifyToken);

export default router;
