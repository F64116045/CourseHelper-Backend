import {Request, Response} from 'express';
import { TimetableData, IClassItem, ITimetableData} from '../model/Timetable';
import { Course } from '../model/Course';
import mongoose from 'mongoose';
import { Attendance } from '../model/Attendance';
import { request } from 'http';

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



export const deleteCourse = async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: '未授權: 缺少 userId' });

    const courseId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({ message: 'Invalid course id' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        const course = await Course.findOne({ _id: courseId, userId }).session(session);

        if (!course) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: '找不到 Course' });
        }

        // 刪除點名紀錄
        await Attendance.deleteMany({ courseId }).session(session);

        // 刪除課程
        await Course.deleteOne({ _id: courseId, userId }).session(session);

        // 更新 timetable，移除被刪除課程的 courseId
        const timetable = await TimetableData.findOne({ userId }).session(session);
        if (!timetable) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: '找不到 Timetable' });
        }

        let updated = false;

        for (const row of timetable.rows) {
            for (const cls of row.classes) {
                if (cls.courseId?.toString() === courseId) {
                cls.courseId = undefined;
                updated = true;
                }
            }
        }

        if (updated) {
            await timetable.save({ session });
        }

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({ message: '刪除成功' });
        
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error('deleteCourse error', err);
        return res.status(500).json({ message: 'Server Error: deleteCourse' });
    }
};



export const getCourseDetail = async(req: Request, res: Response) =>{
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: '未授權: 缺少 userId' });

    const courseId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({ message: 'Invalid course id' });
    }
    
    try{
        const course = await Course.findOne({_id: courseId, userId});
        if(!course) return res.status(400).json({ message: '找不到 Course'});

        const timetable = await TimetableData.findOne({ userId });
        
        if (!timetable) {
            return res.status(200).json({
                ...course.toObject(),
                schedule: [],
            });
        }

        const schedule: { day: string; time: string }[] = [];
        timetable.rows.forEach((row, rowIndex) =>{
            row.classes.forEach((classItem, colIndex)=>{
                if(classItem.courseId?.toString() === courseId){
                    const day = timetable.columns[colIndex];
                    schedule.push({
                        day,
                        time: row.time,
                    });
                }
            });
        });

        return res.json({
            ...course.toObject(),
            schedule,
        });

    }catch(err){
         console.error('取得課程詳細錯誤:', err);
        return res.status(500).json({ error: '伺服器錯誤' });
    }
}