import dotenv from 'dotenv';
import path from 'path';
import mongoose, { Types } from 'mongoose';


import User from '../model/User';
import { Semester, ISemester } from '../model/Semester';
import { TimetableData } from '../model/Timetable';


dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function run() {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error('MONGO_URI missing');

    await mongoose.connect(uri);
    console.log('MongoDB connected');

    const users = await User.find({}, { _id: 1 }).lean();
    console.log(`👥 Users to process: ${users.length}`);

    for (const u of users) {
        // 找到/建立該使用者的「未分配」學期
        const sem = await Semester.findOneAndUpdate(
            { userId: u._id as Types.ObjectId, name: '未分配' },
            { $setOnInsert: { userId: u._id, name: '未分配', isArchived: false } },
            { upsert: true, new: true }
        ).lean<ISemester>();

        // 補上 Timetable 的 semesterId（僅限尚未有 semesterId 的課表）
        const res = await TimetableData.updateMany(
            { userId: u._id, $or: [{ semesterId: { $exists: false } }, { semesterId: null }] },
            { $set: { semesterId: sem._id } }
        );
        if (res.modifiedCount > 0) {
            console.log(`🗂️  Timetable updated for user=${u._id}: ${res.modifiedCount}`);
        }
    }

    //  建立唯一索引：同一位使用者每個學期只會有一張課表
    try {
        await TimetableData.collection.createIndex(
            { userId: 1, semesterId: 1 },
            { unique: true, name: 'uniq_user_semester_timetable' }
        );
        console.log('Index ensured: uniq_user_semester_timetable(userId, semesterId)');
    } catch (e) {
        console.warn('Create index warning (can be ignored if already exists):', (e as Error).message);
    }

    await mongoose.disconnect();
    console.log(' Done.');
}

run().catch(async (e) => {
    console.error(' Migration failed:', e);
    try {
        await mongoose.disconnect();
    } catch {}
    process.exit(1);
});
