import express from 'express';
import jwt from 'jsonwebtoken';
import JwtPayload from '../model/Jwt';
import { Request, Response } from 'express';
const JWT_SECRET = process.env.JWT_SECRET || 'ACCESS_SECRET';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'REFRESH_SECRET';

export const refreshToken = (req: Request, res: Response)=>{
    const  token = req.cookies.refreshToken;
    if(!token) return res.status(401).json({message:'Refresh Token ERROR'});

    try{
        const payload = jwt.verify(token, REFRESH_SECRET) as JwtPayload;
        const newAccessToken = jwt.sign({userId: payload.userId}, JWT_SECRET, {expiresIn: '30m'});
        res.json({token:newAccessToken});
    }catch(err){
        console.log('Refresh Token 驗證失敗')
        res.status(403).json({ message: 'Refresh Token 無效' });
    }
}