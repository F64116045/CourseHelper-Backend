import {Request, Response} from 'express';
import {TimetableData} from '../model/Timetable';
import { Types } from 'mongoose';
import { mockTimetable } from '../data/mockTimetable';

export const getTimetable = async (req: Request, res: Response) => {
    try {
        if (!req.user?.userId) return res.status(401).json({ message: '未授權' });

        const { semesterId } = req.params;
        if (!Types.ObjectId.isValid(semesterId)) {
            return res.status(400).json({ message: 'semesterId 不合法' });
        }

        const userId = new Types.ObjectId(req.user.userId);
        const sId = new Types.ObjectId(semesterId);

        const tt = await TimetableData.findOneAndUpdate(
            { userId, semesterId: sId },
            { $setOnInsert: { userId, semesterId: sId } }, 
            { upsert: true, new: true, setDefaultsOnInsert: true }
        ).lean();

        return res.json(tt);
    } catch (err) {
        console.error('getTimetable error', err);
        return res.status(500).json({ message: 'Server:未知錯誤' });
    }
};


export const updateTimetable = async (req: Request, res: Response) => {
    try {
        if (!req.user?.userId) return res.status(401).json({ message: '未授權' });

        const { semesterId } = req.params;                       // ← 從路由拿學期
        if (!Types.ObjectId.isValid(semesterId)) {
            return res.status(400).json({ message: 'semesterId 不合法' });
        }

        const userId = new Types.ObjectId(req.user.userId);
        const sId = new Types.ObjectId(semesterId);

        // 前端只會送 rows/columns，要寫哪個就帶哪個
        const { rows, columns } = req.body as { rows?: any[]; columns?: string[] };
        const $set: Record<string, unknown> = {};
        if (rows !== undefined) $set.rows = rows;
        if (columns !== undefined) $set.columns = columns;

        const tt = await TimetableData.findOneAndUpdate(
            { userId, semesterId: sId },                         // ← 鎖定「這學期」這個人
            { $set, $setOnInsert: { userId, semesterId: sId } }, // ← 沒有就新建
            {
                upsert: true,                                    // ← 查不到就新增
                new: true,                                       // ← 回傳更新後的文件
                runValidators: true,
                setDefaultsOnInsert: true                        // ← 新建時吃 schema 的預設 rows/columns
            }
        ).lean();

        return res.status(200).json(tt);
    } catch (err) {
        console.error('updateTimetable error', err);
        return res.status(500).json({ message: '伺服器錯誤' });
    }
};