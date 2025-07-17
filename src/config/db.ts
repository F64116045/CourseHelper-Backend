import mongoose from 'mongoose';

const connectDB = async() =>{
    try{
        const uri = process.env.MONGO_URI as string;
        await mongoose.connect(uri);
        console.log('MongoDB 連線成功');
    }catch(err){
        console.log('MongoDB 連線失敗',err);
        process.exit(1);
    }
}

export default connectDB;