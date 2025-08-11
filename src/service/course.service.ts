import mongoose from 'mongoose';
import { Course } from '../model/Course';
import { TimetableData } from '../model/Timetable';
import { Attendance } from '../model/Attendance';

type CreateCourseInput = {
    name: string;
    color?: string;
    credit?: number;
    notificationsEnabled?: boolean;
    type: any;
    semesterId: string;
};

export async function getCourseList(userId: string, semesterId: string) {
    return Course.find({ userId, semesterId });
}

export async function createCourse(userId: string, input: CreateCourseInput) {
    const newCourse = new Course({
        userId,
        name: input.name,
        color: input.color,
        credit: input.credit,
        notificationsEnabled: input.notificationsEnabled ?? false,
        type: input.type,
        semesterId: input.semesterId,
    });
    await newCourse.save();
    return newCourse;
}

export async function deleteCourse(userId: string, courseId: string, semesterId: string) {
    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
            console.log('deleteCourse args', { userId, courseId, semesterId });
            console.log('types', {
                userIdType: typeof userId,
                courseIdType: typeof courseId,
                semesterIdType: typeof semesterId,
            });
            
            const course = await Course.findOne({ _id: courseId, userId, semesterId }).session(session);
            if (!course) {
                throw new Error('找不到 Course');
            }

            await Attendance.deleteMany({ courseId }).session(session);

            const timetable = await TimetableData.findOne({ userId, semesterId }).session(session);
            if (!timetable) {
                throw new Error('找不到 Timetable');
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
                // 如果 rows 是 Mixed 型別
                // timetable.markModified('rows');
                await timetable.save({ session });
            }

            await Course.deleteOne({ _id: courseId, userId, semesterId }).session(session);
        });
    } finally {
        await session.endSession();
    }
}


export async function getCourseDetail(userId: string, courseId: string) {
    const course = await Course.findOne({ _id: courseId, userId});
    if (!course) {
        const e = new Error('找不到 Course');
        (e as any).status = 404;
        throw e;
    }

    const timetable = await TimetableData.findOne({ userId });
    if (!timetable) {
        return {
            ...course.toObject(),
            schedule: [] as Array<{ day: string; time: string }>,
        };
    }

    const schedule: { day: string; time: string }[] = [];
    timetable.rows.forEach((row) => {
        row.classes.forEach((classItem, colIndex) => {
            if (classItem.courseId?.toString() === courseId) {
                const day = timetable.columns[colIndex];
                schedule.push({ day, time: row.time });
            }
        });
    });

    return {
        ...course.toObject(),
        schedule,
    };
}
