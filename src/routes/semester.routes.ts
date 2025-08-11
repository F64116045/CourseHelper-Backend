import { Router } from 'express';
import { createSemesterHandler , getSemestersHandler} from '../controllers/controller.semester';
import {getTimetable, updateTimetable } from '../controllers/controller.timetable';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, createSemesterHandler);
router.get('/', authMiddleware, getSemestersHandler);
router.get('/:semesterId/timetable', authMiddleware, getTimetable);
router.put('/:semesterId/timetable', authMiddleware, updateTimetable);

export default router;
