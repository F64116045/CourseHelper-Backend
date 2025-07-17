import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {getTimetable, updateTimetable } from '../controllers/controller.timetable';

const router = express.Router();
router.get('/', authMiddleware, getTimetable);
router.put('/', authMiddleware, updateTimetable);


export default router;