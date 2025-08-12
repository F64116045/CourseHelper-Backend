import { Request, Response, NextFunction } from 'express';
import * as semesterService from '../service/semester.service';

export async function createSemesterHandler(req: Request, res: Response) {
    try {
        console.log('req.user:', req.user);
        console.log('req.body:', req.body);

        if (!req.user || !req.user.userId) {
            return res.status(401).json({ error: 'Unauthorized: no userId found' });
        }

        const { semesterName } = req.body;
        if (!semesterName || typeof semesterName !== 'string') {
            return res.status(400).json({ error: 'semesterName is required and must be a string' });
        }

        const semester = await semesterService.createSemester({
            userId: req.user.userId,
            name: semesterName,
        });

        return res.status(201).json({ semester });
    } catch (err: any) {
        console.error(err);
        if (err.code === 11000) {
            return res.status(409).json({ error: 'Semester already exists' });
        }
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}


export async function getSemestersHandler(req: Request, res: Response) {
    try {
        const userId = req.user!.userId;
        const semesters = await semesterService.listSemesters(userId);
        return res.json({ semesters });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}


export async function deleteSemesterCascadeHandler(req: Request, res: Response) {
    const userId = req.user!.userId;
    const { semesterId } = req.params;

    try {
        const result = await semesterService.deleteSemesterCascade(userId, semesterId);
        return res.status(200).json(result);
    } catch (e: any) {
        const status = Number(e?.status) || 500;
        const message = typeof e?.message === 'string' ? e.message : 'Internal Server Error';
        return res.status(status).json({ error: message });
    }
}