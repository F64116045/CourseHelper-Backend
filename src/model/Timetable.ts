import mongoose, {Schema, Document, Types} from 'mongoose';
/*
{
  "columns": ["週一", "週二", "週三", "週四", "週五"],
  "rows": [
    {
      "time": "08:00 - 09:00",
      "classes": [
        { "name": "英文", "color": "#FFAABB" },
        { "name": "數學", "color": "#66CCFF" },
        { "name": "歷史", "color": "#00FF88" },
        { "name": "理化" },
        { "name": "體育" }
      ]
    }
  ]
}
*/
export interface IClassItem {
    name: string;
    color?: string;
}

const ClassItemSchema = new Schema<IClassItem>({
    name: { type: String, required: true },
    color: { type: String, required: false },
});

export interface ITimetableRows extends Document {
    time: string;
    classes: IClassItem[];
}

const TimetableRowsSchema = new Schema<ITimetableRows>({
    time: { type: String, required: true },
    classes: { type: [ClassItemSchema], required: true },
});

const TimetableRows = mongoose.model<ITimetableRows>('TimetableRows', TimetableRowsSchema);

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

const TimetableData = mongoose.model<ITimetableData>('TimetableData', TimetableDataSchema);


export default TimetableData;