import { Schema, model, Types, Document } from 'mongoose';

export interface ICourse extends Document {
    userId: Types.ObjectId;         // 哪個使用者的課
    name: string;                   // 課程名稱（如 數學）
    color?: string;                 // 顏色顯示用
    attendanceCount: number;       // 點名次數
    notificationsEnabled: boolean; // 是否啟用點名通知
}

const CourseSchema = new Schema<ICourse>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    color: { type: String },
    attendanceCount: { type: Number, default: 0 },
    notificationsEnabled: { type: Boolean, default: false },
});

export const Course = model<ICourse>('Course', CourseSchema);
