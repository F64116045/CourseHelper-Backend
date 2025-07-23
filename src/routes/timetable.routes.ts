import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {getTimetable, updateTimetable } from '../controllers/controller.timetable';
import { getCourseList } from '../controllers/controller.courseList';

const router = express.Router();
router.get('/', authMiddleware, getTimetable);
router.put('/', authMiddleware, updateTimetable);

//CourseList
router.get('/course-list', authMiddleware, getCourseList);

export default router;