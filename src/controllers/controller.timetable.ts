import {Request, Response} from 'express';
import {TimetableData} from '../model/Timetable';
import { mockTimetable } from '../data/mockTimetable';

export const getTimetable = async(req: Request, res: Response)=>{
    try{
        const userId = req.user.userId;
        console.log('Import module:', require('../model/Timetable'));
        console.log(`${userId}嘗試獲取timetable資料`, TimetableData);
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


export const updateTimetable = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: '使用者未授權' });
        }

        const userId = req.user.userId;
        const { columns, rows } = req.body;

        

        const timetable = await TimetableData.findOneAndUpdate(
            { userId },
            { columns, rows },
            { new: true }
        );

        console.log('有人在更新課表:', timetable);

        if (!timetable) {
            return res.status(404).json({ message: '找不到課表，無法更新' });
        }

        return res.status(200).json({ message: '課表更新成功' });
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('後端更新課表錯誤:', err.message);
            res.status(500).json({ message: '伺服器錯誤', error: err.message });
        } else {
            console.error('後端更新課表錯誤:', err);
            res.status(500).json({ message: '伺服器錯誤', error: String(err) });
        }
    }
};