import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {getTimetable, updateTimetable } from '../controllers/controller.timetable';
import { getCourseList ,createCourse, deleteCourse} from '../controllers/controller.courseList';

const router = express.Router();
router.get('/', authMiddleware, getTimetable);
router.put('/', authMiddleware, updateTimetable);

//CourseList
router.get('/course-list', authMiddleware, getCourseList);
router.post('/course-list', authMiddleware, createCourse);
router.delete('/course-list', authMiddleware, deleteCourse);

export default router;