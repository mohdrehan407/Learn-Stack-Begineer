import { Response } from 'express';
import { executeQuery } from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const createSubject = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, orderIndex } = req.body;
        const result = await executeQuery('INSERT INTO subjects (title, description, order_index) VALUES (?, ?, ?)', [title, description, orderIndex || 0]);
        res.json({ message: 'Subject created', id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating subject', error: String(error) });
    }
};

export const createSection = async (req: AuthRequest, res: Response) => {
    try {
        const { subjectId, title, orderIndex } = req.body;
        const result = await executeQuery('INSERT INTO sections (subject_id, title, order_index) VALUES (?, ?, ?)', [subjectId, title, orderIndex || 0]);
        res.json({ message: 'Section created', id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating section', error: String(error) });
    }
};

export const createVideo = async (req: AuthRequest, res: Response) => {
    try {
        const { sectionId, title, videoUrl, duration, orderIndex } = req.body;
        const result = await executeQuery('INSERT INTO videos (section_id, title, video_url, duration, order_index) VALUES (?, ?, ?, ?, ?)', [sectionId, title, videoUrl, duration || 0, orderIndex || 0]);
        res.json({ message: 'Video created', id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating video', error: String(error) });
    }
};

export const updateOrder = async (req: AuthRequest, res: Response) => {
    try {
        const { table, items } = req.body;
        if (!['subjects', 'sections', 'videos'].includes(table)) {
            return res.status(400).json({ message: 'Invalid table' });
        }
        await Promise.all(items.map((item: any) =>
            executeQuery(`UPDATE ${table} SET order_index = ? WHERE id = ?`, [item.orderIndex, item.id])
        ));
        res.json({ message: 'Order updated' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order', error: String(error) });
    }
};

export const getAdminStats = async (req: AuthRequest, res: Response) => {
    try {
        const [users, subjects, enrollments] = await Promise.all([
            executeQuery('SELECT COUNT(*) as count FROM users'),
            executeQuery('SELECT COUNT(*) as count FROM subjects'),
            executeQuery('SELECT COUNT(*) as count FROM enrollments')
        ]);
        res.json({
            users: users[0].count,
            subjects: subjects[0].count,
            enrollments: enrollments[0].count
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error: String(error) });
    }
};
