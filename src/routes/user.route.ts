import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { setCurrentSemester } from '../controllers/user.controller';

const router = Router();
router.patch('/me/current-semester', authMiddleware, setCurrentSemester);
export default router;
