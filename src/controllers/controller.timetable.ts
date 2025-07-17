import {Request, Response} from 'express';
import TimetableData from '../model/Timetable';
import { mockTimetable } from '../data/mockTimetable';

export const getTimetable = async(req: Request, res: Response)=>{
    try{
        const userId = req.user.userId;
        console.log(`${userId}嘗試獲取timetable資料`);
        let timetable = await TimetableData.findOne({userId});

        if(!timetable){
            timetable = new TimetableData({
                userId,
                ...mockTimetable,    
            });
            await timetable.save();
        };

        res.json(timetable);

    }catch(err){
        console.log(err);
        res.status(500).json({message: 'Server:未知錯誤'});
    }
}


export const updateTimetable = async (req: Request, res: Response) =>{
    try{
        const userId = req.user.userId;
        const { columns, rows } = req.body;

        console.log('shit, 有人在更新課表');

        const timetable = await TimetableData.findOneAndUpdate(
            { userId },
            { columns, rows},
            { new : true},
        );

        if (!timetable) {
            return res.status(404).json({ message: '找不到課表，無法更新' });
        }
        
        res.json({message: '課表更新成功', timetable});
    }catch(err){

    }
}