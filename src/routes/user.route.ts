import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { setCurrentSemester, getCurrentSemesterHandler } from '../controllers/user.controller';

const router = Router();
router.patch('/me/current-semester', authMiddleware, setCurrentSemester);
router.get('/me/current-semester', authMiddleware, getCurrentSemesterHandler);
export default router;
