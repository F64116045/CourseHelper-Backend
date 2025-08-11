import mongoose, { Schema, model, Types, Document } from 'mongoose';

/** 子格：課表單一節的格子（對應一天中的一節） */
export interface IClassItem {
    courseId?: Types.ObjectId | null; // 對應 Course；預設 null
}

const ClassItemSchema = new Schema<IClassItem>(
    {
        courseId: { type: Schema.Types.ObjectId, ref: 'Course', default: null },
    },
    { _id: false }
);

/** 一列（某一節）：時間 + 七天的格子 */
export interface ITimetableRow {
    time: string;
    classes: IClassItem[]; // 長度 7
}

const TIMES: string[] = [
    '07:00 ~ 07:50', '08:00 ~ 08:50', '09:00 ~ 09:50',
    '10:10 ~ 11:00', '11:10 ~ 12:00', '12:10 ~ 13:00',
    '13:10 ~ 14:00', '14:10 ~ 15:00', '15:20 ~ 16:10',
    '16:20 ~ 17:10', '17:20 ~ 18:10', '18:20 ~ 19:10',
    '19:15 ~ 20:05', '20:10 ~ 21:00', '21:05 ~ 21:55',
];

function defaultClasses(): IClassItem[] {
    // 一定要用 map 生成新物件，避免 Array.fill 產生同一個參考
    return Array.from({ length: 7 }, () => ({ courseId: null }));
}

function defaultRows(): ITimetableRow[] {
    return TIMES.map((time) => ({
        time,
        classes: defaultClasses(),
    }));
}

const TimetableRowSchema = new Schema<ITimetableRow>(
    {
        time: { type: String, required: true },
        classes: {
            type: [ClassItemSchema],
            default: defaultClasses,
            validate: {
                validator: (arr: IClassItem[]) => Array.isArray(arr) && arr.length === 7,
                message: 'classes 必須是 7 個（週一到週日）',
            },
        },
    },
    { _id: false }
);

/** 主文件 */
export interface ITimetableData extends Document {
    userId: Types.ObjectId;
    semesterId: Types.ObjectId;
    columns: string[];
    rows: ITimetableRow[];
}

const TimetableDataSchema = new Schema<ITimetableData>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        semesterId: { type: Schema.Types.ObjectId, ref: 'Semester', required: true },

        columns: {
            type: [String],
            default: () => ['一', '二', '三', '四', '五', '六', '日'],
        },

        rows: {
            type: [TimetableRowSchema],
            default: defaultRows, // ← 有預設骨架
        },
    },
    { timestamps: true }
);

// 一人 × 一學期 一張表
TimetableDataSchema.index({ userId: 1, semesterId: 1 }, { unique: true });

export const TimetableData = model<ITimetableData>('TimetableData', TimetableDataSchema);
