import {Request, Response} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import User from '../model/User';

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in env');
}

if (!REFRESH_SECRET){
    throw new Error('REFRESH_SECRET is not defined in env');
}

export const loginUser = async(req: Request, res: Response)=>{
    try{
        const{email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: '請提供 Email 與密碼' });
        }

        const user = await User.findOne({email});

        if(!user) return res.status(400).json({message : 'Email錯誤'});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({message : '密碼錯誤'});

        const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn:'1h'});
        const refreshToken = jwt.sign({userId: user._id}, REFRESH_SECRET, {expiresIn:'7d'});

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none', 
            path: '/api/auth', 
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });


        return res.status(200).json({ token: token , name: user.name, email: user.email});
    }catch(err){
        console.log(err);
        res.status(500).json({message: 'Server : 未知錯誤'});
    }
}