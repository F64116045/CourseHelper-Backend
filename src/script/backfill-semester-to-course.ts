import dotenv from 'dotenv';
import path from 'path';
import mongoose, { Types } from 'mongoose';
import  User  from '../model/User';
import { Semester, ISemester } from '../model/Semester';
import { Course } from '../model/Course';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
async function run() {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error('MONGO_URI missing');
    await mongoose.connect(uri);

    const users = await User.find({}, { _id: 1, currentSemesterId: 1 }).lean();
    for (const u of users) {
        const sem = await Semester.findOneAndUpdate(
            { userId: u._id as Types.ObjectId, name: '未分配' },
            { $setOnInsert: { userId: u._id, name: '未分配', isArchived: false } },
            { upsert: true, new: true }
        ).lean<ISemester>();

        await Course.updateMany(
            { userId: u._id, $or: [{ semesterId: { $exists: false } }, { semesterId: null }] },
            { $set: { semesterId: sem._id } }
        );

        if (!u.currentSemesterId) {
            await User.updateOne(
                { _id: u._id },
                { $set: { currentSemesterId: sem._id } }
            );
        }
    }

    await mongoose.disconnect();
}

run().catch(async (e) => {
    console.error(e);
    try { await mongoose.disconnect(); } catch {}
    process.exit(1);
});
