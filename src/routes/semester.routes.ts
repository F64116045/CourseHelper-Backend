import { Router } from 'express';
import { createSemesterHandler , getSemestersHandler} from '../controllers/controller.semester';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, createSemesterHandler);
router.get('/', authMiddleware, getSemestersHandler);

export default router;
