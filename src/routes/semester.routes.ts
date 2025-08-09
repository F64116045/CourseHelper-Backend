import { Router } from 'express';
import { createSemesterHandler } from '../controllers/controller.semester';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, createSemesterHandler);

export default router;
