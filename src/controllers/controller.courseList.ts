import { Request, Response } from 'express';
import * as CourseService from '../service/course.service';
import mongoose from 'mongoose';
import { CourseType } from '../model/Course';

export const getCourseList = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: '未授權: 缺少 userId' });

        const { semesterId } = req.query as { semesterId?: string };
        if (!semesterId || !mongoose.Types.ObjectId.isValid(semesterId)) {
            return res.status(400).json({ message: '缺少或無效的 semesterId' });
        }

        const courses = await CourseService.getCourseList(userId, semesterId);
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

        const { name, color, credit, notificationsEnabled, type, semesterId } = req.body;

        if (!name) return res.status(400).json({ message: '課程名稱是必填欄位' });
        if (!semesterId || !mongoose.Types.ObjectId.isValid(semesterId)) {
            return res.status(400).json({ message: '缺少或無效的 semesterId' });
        }
        const allowedTypes = ['必修', '選修', '通識'];
        if (!allowedTypes.includes(type)) {
            return res.status(400).json({ message: '課程種類必須是 必修 / 選修 / 通識 之一' });
        }

        const course = await CourseService.createCourse(userId, {
            name,
            color,
            credit,
            notificationsEnabled: notificationsEnabled ?? false,
            type,
            semesterId,
        });

        res.status(201).json(course);
    } catch (err: any) {
        console.error('createCourse error:', {
            name: (err as any)?.name,
            code: (err as any)?.code,
            message: (err as any)?.message,
            errors: (err as any)?.errors
        });

        if ((err as any)?.code === 11000) {
            return res.status(409).json({ message: '同一學期下已存在相同課程名稱' });
        }
        if ((err as any)?.name === 'ValidationError') {
            return res.status(400).json({ message: '資料驗證失敗', details: (err as any)?.errors });
        }
        res.status(500).json({ message: 'Server Error: create Course' });
    }
};

export const deleteCourse = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: '未授權: 缺少 userId' });

        const { id } = req.params;
        const { semesterId } = req.query as { semesterId?: string };

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid course id' });
        }
        if (!semesterId || !mongoose.Types.ObjectId.isValid(semesterId)) {
            return res.status(400).json({ message: '缺少或無效的 semesterId' });
        }

        await CourseService.deleteCourse(userId, id, semesterId);
        res.status(200).json({ message: '刪除成功' });
    } catch (err) {
        console.error('deleteCourse error:', err);
        res.status(500).json({ message: 'Server Error: deleteCourse' });
    }
};

export const getCourseDetail = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: '未授權: 缺少 userId' });

        const { id } = req.params;
        const { semesterId } = req.query as { semesterId?: string };

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid course id' });
        }

        const detail = await CourseService.getCourseDetail(userId, id);
        res.json(detail);
    } catch (err) {
        console.error('取得課程詳細錯誤:', err);
        res.status(500).json({ error: '伺服器錯誤' });
    }
};
