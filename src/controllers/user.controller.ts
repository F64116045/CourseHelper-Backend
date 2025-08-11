import { Request, Response } from 'express';
import * as UserService from '../service/user.service';

export const setCurrentSemester = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: '未授權' });
        }

        const { semesterId } = req.body as { semesterId?: string };
        if (!semesterId) {
            return res.status(400).json({ message: '缺少或無效的 semesterId' });
        }

        const result = await UserService.setCurrentSemester(userId, semesterId);

        return res.status(200).json({ message: '更新成功', ...result });
    } catch (err: any) {
        console.error('setCurrentSemester error:', err);

        if (err?.status === 400) {
            return res.status(400).json({ message: err.message || '參數錯誤' });
        }
        return res.status(500).json({ message: 'Server Error: setCurrentSemester' });
    }
};


export async function getCurrentSemesterHandler(req: Request, res: Response) {
    const userId = req.user!.userId;
    const { semesterId } = await UserService.getCurrentSemester(userId);
    return res.json({ semesterId });
}