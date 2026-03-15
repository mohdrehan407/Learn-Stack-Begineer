import { Response } from 'express';
import { executeQuery } from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const saveProgress = async (req: AuthRequest, res: Response) => {
    try {
        const { videoId, progressSeconds, isCompleted } = req.body;
        const userId = req.user!.id;
        const completedVal = isCompleted ? 1 : 0;

        const existing = await executeQuery('SELECT id FROM video_progress WHERE user_id = ? AND video_id = ?', [userId, videoId]);
        if (existing.length > 0) {
            await executeQuery(
                'UPDATE video_progress SET progress_seconds = ?, is_completed = GREATEST(is_completed, ?) WHERE user_id = ? AND video_id = ?',
                [progressSeconds, completedVal, userId, videoId]
            );
        } else {
            await executeQuery(
                'INSERT INTO video_progress (user_id, video_id, progress_seconds, is_completed) VALUES (?, ?, ?, ?)',
                [userId, videoId, progressSeconds, completedVal]
            );
        }
        res.json({ message: 'Progress saved' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving progress', error: String(error) });
    }
};
