import mongoose from 'mongoose';
import { Semester } from '../model/Semester';

interface CreateSemesterInput{
    userId: string;
    name: string;
}

export async function createSemester(input: CreateSemesterInput){
    const session = await mongoose.startSession();

    try{
        session.startTransaction();
        const semester = await Semester.create(
            { userId: input.userId, name: input.name, isArchived: false },
            { session }
        );

        await session.commitTransaction();
        return semester;
    }catch(err: any){
        await session.abortTransaction();
        if (err?.code === 11000) {
            const e = new Error('Semester with the same name already exists for this user.');
            (e as any).status = 409;
            throw e;
        }
        throw err;
    }finally {
        session.endSession();
    }
}