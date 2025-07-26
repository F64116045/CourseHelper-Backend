import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { markAttendance, getAttendanceHistory } from '../controllers/controller.attendance';


const router = express.Router();
router.post('/mark', authMiddleware, markAttendance);
router.get('/history', authMiddleware, getAttendanceHistory);

export default router;