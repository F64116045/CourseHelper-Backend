import mongoose from 'mongoose';
import { Semester } from '../model/Semester';

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