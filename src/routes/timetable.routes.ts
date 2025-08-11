import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {getTimetable, updateTimetable } from '../controllers/controller.timetable';
import { getCourseList ,createCourse, deleteCourse, getCourseDetail} from '../controllers/controller.courseList';

const router = express.Router();
//CourseList

// GET /course-list?semesterId=xxx
router.get('/course-list', authMiddleware, getCourseList);

// POST /course-list   （body 需帶 { ..., semesterId }）
router.post('/course-list', authMiddleware, createCourse);

// DELETE /course-list/:id?semesterId=xxx
router.delete('/course-list/:id', authMiddleware, deleteCourse);

// GET /course-list/:id?semesterId=xxx
router.get('/course-list/:id', authMiddleware, getCourseDetail);

export default router;