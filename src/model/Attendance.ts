import { Schema, model, Types, Document } from 'mongoose';

export interface IAttendance extends Document {
	courseId: Types.ObjectId;   // 對應課程
	date: string;              
	status: 'present' | 'absent';
	note?: string;
}

const AttendanceSchema = new Schema<IAttendance>({
	courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
	date: { type: String, required: true },
	status: { type: String, enum: ['present', 'absent'], required: true },
	note: { type: String, default: '' },
}, { timestamps: true });

AttendanceSchema.index({ courseId: 1, date: 1 }, { unique: true });

export const Attendance = model<IAttendance>('Attendance', AttendanceSchema);
