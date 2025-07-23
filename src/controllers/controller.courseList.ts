import {Request, Response} from 'express';
import { TimetableData, IClassItem} from '../model/Timetable';
import { request } from 'http';

export const getCourseList = async(req: Request, res: Response) => {
    const userId = req.user.userId;
    console.log('TimetableData:', TimetableData);
    let timetable = await TimetableData.findOne({userId});

    const courseMap = new Map<string, IClassItem>();
    
    timetable?.rows.forEach(row =>{
        row.classes.forEach(item =>{
            if(!courseMap.has(item.className)){
                courseMap.set(item.className, item);
            }
        })
    })

    const uniqueClasses = Array.from(courseMap.values());
    res.json(uniqueClasses);
}


