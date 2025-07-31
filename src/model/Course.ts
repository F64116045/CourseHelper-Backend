import { Schema, model, Types, Document } from 'mongoose';

export enum CourseType {
    Required = '必修',
    Elective = '選修',
    General = '通識',
}

export interface ICourse extends Document {
    userId: Types.ObjectId;         // 哪個使用者的課
    name: string;                   // 課程名稱（如 數學）
    color?: string;                 // 顏色顯示用
    credit: number;
    notificationsEnabled: boolean;
    type: CourseType;
}

const CourseSchema = new Schema<ICourse>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    color: { type: String },
    credit: { type: Number },
    notificationsEnabled: { type: Boolean, default: false },
    type: {
        type: String,
        enum: Object.values(CourseType), // 限定為 enum 中的值
        required: true,
    },
});

export const Course = model<ICourse>('Course', CourseSchema);
