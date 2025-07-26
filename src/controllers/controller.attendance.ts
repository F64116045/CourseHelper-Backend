import { Request, Response } from 'express';
import { Attendance } from '../model/Attendance';
import { Course } from '../model/Course';
import mongoose from 'mongoose';

export const markAttendance = async (req: Request, res: Response) => {
	try {
		const userId = req.user._id; 
		const { courseId, status = 'present', date } = req.body;

		if (!courseId || !['present', 'absent'].includes(status)) {
			return res.status(422).json({ error: '缺少必要欄位或格式錯誤' });
		}

		const course = await Course.findById(courseId);

		if (!course) {
			return res.status(404).json({ error: '課程不存在' });
		}

		if (!course.userId.equals(userId)) {
			return res.status(403).json({ error: '無權限操作' });
		}

		const today = date || new Date().toISOString().slice(0, 10); // yyyy-mm-dd

		const attendance = new Attendance({
			courseId: new mongoose.Types.ObjectId(courseId),
			date: today,
			status,
		});

		await attendance.save();

		res.status(201).json(attendance);
	} catch (err: any) {
		if (err.code === 11000) {
			return res.status(400).json({ error: '今天已經點名過了' });
		}

		console.error('markAttendance error:', err);
		res.status(500).json({ error: '系統內部錯誤' });
	}
};



export const getAttendanceHistory = async (req: Request, res: Response) => {
	try {
		const userId = req.user._id;
		const { courseId, from, to } = req.query;

		if (!courseId || typeof courseId !== 'string') {
			return res.status(422).json({ error: '缺少 courseId' });
		}

		const course = await Course.findById(courseId);

		if (!course) {
			return res.status(404).json({ error: '課程不存在' });
		}

		if (!course.userId.equals(userId)) {
			return res.status(403).json({ error: '無權限操作' });
		}


		const query: any = { courseId };

		if (from && typeof from === 'string') {
			query.date = { $gte: from };
		}
		if (to && typeof to === 'string') {
			query.date = query.date || {};
			query.date.$lte = to;
		}

		const records = await Attendance.find(query)
		.sort({ date: -1 })
		.limit(100)
		.select('date status -_id')
		.exec();

		res.json(records);
	} catch (err) {
		console.error('getAttendanceHistory error:', err);
		res.status(500).json({ error: '系統錯誤' });
	}
};