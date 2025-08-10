import mongoose from 'mongoose';
import  User  from '../model/User';

export async function setCurrentSemester(userId: string, semesterId: string) {
    if (!mongoose.Types.ObjectId.isValid(semesterId)) {
        const err: any = new Error('缺少或無效的 semesterId');
        err.status = 400;
        throw err;
    }

    await User.updateOne(
        { _id: userId },
        { $set: { currentSemesterId: new mongoose.Types.ObjectId(semesterId) } }
    );


    return { semesterId };
}