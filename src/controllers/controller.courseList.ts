import {Request, Response} from 'express';
import { TimetableData, IClassItem} from '../model/Timetable';
import { Course } from '../model/Course';

export const getCourseList = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: '未授權: 缺少 userId' });

        const courses = await Course.find({ userId });

        res.json(courses);
    } catch (err) {
        console.error('getCourseList error:', err);
        res.status(500).json({ message: 'Server Error: get Course List' });
    }
};

export const createCourse = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: '未授權: 缺少 userId' });

        const { name, color, schedule, notificationsEnabled } = req.body;

        if (!name) return res.status(400).json({ message: '課程名稱是必填欄位' });

        const newCourse = new Course({
            userId,
            name,
            color,
            schedule,
            notificationsEnabled: notificationsEnabled ?? false,
            attendanceCount: 0,
        });

        await newCourse.save();

        res.status(201).json(newCourse);
    } catch (err) {
        console.error('createCourse error:', err);
        res.status(500).json({ message: 'Server Error: create Course' });
    }
};



