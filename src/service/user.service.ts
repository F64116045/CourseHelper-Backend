import mongoose from 'mongoose';
import  User  from '../model/User';
import { Semester } from '../model/Semester';

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

export async function getCurrentSemester(userId: string) {
    const user = await User.findById(userId).select('currentSemesterId').lean();
    const id = user?.currentSemesterId as mongoose.Types.ObjectId | undefined;

    if (!id) return { semesterId: null };

    // 確認這個學期確實屬於該使用者
    const exists = await Semester.exists({ _id: id, userId });
    if (!exists) {
        await User.updateOne({ _id: userId }, { $unset: { currentSemesterId: 1 } });
        return { semesterId: null };
    }
    
    return { semesterId: id.toString() };
}