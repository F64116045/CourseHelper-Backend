import mongoose, {Schema, Document, Types} from 'mongoose';
/*
{
  "columns": ["週一", "週二", "週三", "週四", "週五"],
  "rows": [
    {
      "time": "08:00 - 09:00",
      "classes": [
        { "className": "英文", "color": "#FFAABB" },
        { "className": "數學", "color": "#66CCFF" },
        { "className": "歷史", "color": "#00FF88" },
        { "className": "理化" },
        { "className": "體育" }
      ]
    }
  ]
}
*/
export interface IClassItem {
  courseId?: Types.ObjectId | null; // 對應 Course
}

const ClassItemSchema = new Schema<IClassItem>({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: false },
});


export interface ITimetableRows extends Document {
    time: string;
    classes: IClassItem[];
}

const TimetableRowsSchema = new Schema<ITimetableRows>({
    time: { type: String, required: true },
    classes: { type: [ClassItemSchema], required: true },
});


export interface ITimetableData extends Document{
    userId: Types.ObjectId;
    columns: string[];
    rows: ITimetableRows[];
};

const TimetableDataSchema: Schema = new Schema<ITimetableData>({
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},

    columns:{
        type:[String],
        required:true,
    },

    rows:{
        type:[TimetableRowsSchema],
        required:true,
    },
});

export const TimetableData = mongoose.model<ITimetableData>('TimetableData', TimetableDataSchema);