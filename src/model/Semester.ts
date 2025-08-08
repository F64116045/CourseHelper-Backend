import mongoose, {Schema, Document, Types} from 'mongoose';

export interface ISemester extends Document {
  userId: Types.ObjectId;             // 對應 User
  name: string;                       // 如「112-1」、「Fall 2025」
  startDate?: Date;
  endDate?: Date;
  isArchived: boolean;               // 是否已結束（可切換顯示）
}

const SemesterSchema = new Schema<ISemester>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  isArchived: { type: Boolean, default: false },
});

export const Semester = mongoose.model<ISemester>('Semester', SemesterSchema);
