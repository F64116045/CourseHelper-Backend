import { Request, Response, NextFunction } from 'express';
import * as semesterService from '../service/semester.service';

export async function createSemesterHandler(req: Request, res: Response, next: NextFunction){
    try{
        const userId = req.user!.id;
        const { semesterName } = req.body;

        if(!semesterName || typeof semesterName !== 'string'){
            return res.status(400).json({ error: 'semesterName is required and must be a string' });
        }

        const semester = await semesterService.createSemester({
            userId,
            name: semesterName,
        })

        res.status(201).json({semester});
    } catch(err: any){
        console.error(err);
        if (err.code === 11000) {
            return res.status(409).json({ error: 'Semester already exists' });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

