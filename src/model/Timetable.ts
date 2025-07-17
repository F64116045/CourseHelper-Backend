import mongoose, {Schema, Document, Types} from 'mongoose';
/*
資料範例
{
  columns: ["週一", "週二", "週三", "週四", "週五"],
  rows: [
    {
      time: "08:00 - 09:00",
      classes: ["英文", "數學", "歷史", "理化", "體育"]
    }
  ]
}
*/
export interface ITimetableRows extends Document{
    time: string;
    classes: string[];
};

const TimetableRowsSchema: Schema = new Schema<ITimetableRows>({
    time:{
        type:String,
        required:true,
    },

    classes:{
        type:[String],
        required:true,
    },
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