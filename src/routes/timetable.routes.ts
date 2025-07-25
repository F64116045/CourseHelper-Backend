import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {getTimetable, updateTimetable } from '../controllers/controller.timetable';
import { getCourseList ,createCourse, deleteCourse, getCourseDetail} from '../controllers/controller.courseList';

const router = express.Router();
router.get('/', authMiddleware, getTimetable);
router.put('/', authMiddleware, updateTimetable);

//CourseList
router.get('/course-list', authMiddleware, getCourseList);
router.post('/course-list', authMiddleware, createCourse);
router.delete('/course-list/:id', authMiddleware, deleteCourse);
router.get('/course-list/:id', authMiddleware, getCourseDetail);

export default router;