import { Router } from 'express';
import { getCourses, addCourse, updateCourse } from '../controllers/courseController';
import { verifyUser } from '../middleware/userAuthMiddleware';

const router = Router();

// Public routes
router.get('/', getCourses);

// Protected routes (admin/user)
router.post('/add', verifyUser, addCourse);
router.put('/update/:course_id', verifyUser, updateCourse);

export default router;
