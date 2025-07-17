import {Request, Response} from 'express';
import bcrypt from 'bcryptjs';
import User from '../model/User';

export const registerUser = async (req: Request, res: Response) =>{
    try{
        const {name, email, password} = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: 'Email 已被註冊'});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        
        res.status(201).json({message: '註冊成功 ! '});
    }catch(err){
        console.error('註冊失敗', err);
        res.status(500).json({message:'註冊失敗、請檢查是否符合格式'});
    }
}