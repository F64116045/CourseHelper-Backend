import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import JwtPayload from '../model/Jwt';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in env');
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) =>{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({message : '未提供授權token'});
    }
    const token = authHeader.split(' ')[1];

    try{
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        
        req.user = decoded;
        next();
    }catch(err){
        return res.status(401).json({message : "Invalid or expired token", error: err});
    }
}