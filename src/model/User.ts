import mongoose, {Schema, Document} from 'mongoose';

export interface IUser extends Document{
    name: string;
    email: string;
    password: string;
    createdAt: Date;
}

const UserSchema: Schema = new Schema<IUser>({
    name:{
        type:String,
        required: true,
        trim: true,
    },

    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    password: {
        type: String,
        required: true,
        minlength: 6,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },


})

const User = mongoose.model<IUser>('User', UserSchema);
export default User;