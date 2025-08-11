import mongoose from 'mongoose';
import { Semester } from '../model/Semester';
import User from '../model/User';
import { Course } from '../model/Course';
import { Types } from 'mongoose';
import { TimetableData } from '../model/Timetable';

interface CreateSemesterInput{
    userId: string;
    name: string;
}

export async function createSemester(input: CreateSemesterInput) {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        const semesterDocs = await Semester.create(
            [{ userId: input.userId, name: input.name, isArchived: false }],
            { session }
        );

        await session.commitTransaction();
        return semesterDocs[0];
    } catch (err: any) {
        await session.abortTransaction();
        if (err?.code === 11000) {
            const e = new Error('Semester with the same name already exists for this user.');
            (e as any).status = 409;
            throw e;
        }
        throw err;
    } finally {
        session.endSession();
    }
}


export async function listSemesters(userId: string) {
    return Semester.find({ userId }).sort({ name: 1 }).lean();
}


type RemovedCounts = { courses: number; timetables: number };
type DeleteCascadeResult = { deleted: true; removed: RemovedCounts; newCurrentSemesterId: string | null };
const badRequest = (msg: string) => Object.assign(new Error(msg), { status: 400 });
const notFound = () => Object.assign(new Error('Not found'), { status: 404 });
/**
 * 同步強制連動刪除
 * - 單一 transaction 內完成：
 *   1) 若刪的是 currentSemester → 回退或清空
 *   2) deleteMany(Course)、deleteMany(Timetable)
 *   3) deleteOne(Semester)
 * - 回傳實際刪除數量與新的 currentSemesterId（若有）
 */
export async function deleteSemesterCascade(
    userId: string,
    semesterId: string
): Promise<DeleteCascadeResult> {
    if (!mongoose.Types.ObjectId.isValid(semesterId)) {
        throw badRequest('無效的 semesterId');
    }

    const session = await mongoose.startSession();
    try {
        const result = await session.withTransaction(async (): Promise<DeleteCascadeResult> => {
            // 1) 驗證歸屬
            const sem = await Semester.findOne({ _id: semesterId, userId }).session(session);
            if (!sem) throw notFound();

            // 2) 若刪的是 current → 回退或清空
            const user = await User.findById(userId).select('currentSemesterId').session(session);
            let newCurrent: string | null = null;

            if (user?.currentSemesterId?.toString() === semesterId) {
                const fallback = await Semester.findOne({ userId, _id: { $ne: sem._id } })
                    .sort({ name: 1 })           // 也可改成 .sort({ createdAt: -1 })
                    .select('_id')
                    .lean<{ _id: Types.ObjectId }>() // 讓 _id 不是 unknown
                    .session(session);

                if (fallback) {
                    newCurrent = fallback._id.toString();
                    await User.updateOne(
                        { _id: userId },
                        { $set: { currentSemesterId: fallback._id } },
                        { session }
                    );
                } else {
                    await User.updateOne(
                        { _id: userId },
                        { $unset: { currentSemesterId: 1 } },
                        { session }
                    );
                    newCurrent = null;
                }
            }

            // 3) 連動刪除 Course / Timetable（拿到實際刪除數）
            const [courseRes, timetableRes] = await Promise.all([
                Course.deleteMany({ userId, semesterId }).session(session),
                TimetableData.deleteMany({ userId, semesterId }).session(session),
            ]);

            // 4) 刪除 Semester 本體
            await Semester.deleteOne({ _id: semesterId, userId }).session(session);

            // 5) 回傳結果（直接從 transaction 回傳，避免 output 未賦值問題）
            return {
                deleted: true,
                removed: {
                    courses: courseRes?.deletedCount ?? 0,
                    timetables: timetableRes?.deletedCount ?? 0,
                },
                newCurrentSemesterId: newCurrent,
            };
        });

        return result;
    } finally {
        session.endSession();
    }
}