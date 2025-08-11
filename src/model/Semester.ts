import mongoose, {Schema, Document, Types} from 'mongoose';

export interface ISemester extends Document {
  userId: Types.ObjectId;             // 對應 User
  name: string;                       // 如「112-1」、「Fall 2025」
  startDate?: Date;
  endDate?: Date;

}

const SemesterSchema = new Schema<ISemester>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
});

export const Semester = mongoose.model<ISemester>('Semester', SemesterSchema);
SemesterSchema.index({ userId: 1, name: 1 }, { unique: true });