import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { executeQuery } from '../config/db';

const generateTokens = (user: { id: number; email: string; role: string }) => {
    const accessToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1h' }
    );
    const refreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET || 'refreshSecret',
        { expiresIn: '7d' }
    );
    return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const existingUsers = await executeQuery('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await executeQuery(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );
        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Error registering user', error: String(error) });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const users = await executeQuery('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const user = users[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const { accessToken, refreshToken } = generateTokens(user);
        await executeQuery('UPDATE users SET refresh_token = ? WHERE id = ?', [refreshToken, user.id]);
        res.json({
            accessToken,
            refreshToken,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in', error: String(error) });
    }
};

export const refresh = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(401).json({ message: 'Refresh token required' });
        const decoded: any = jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'refreshSecret');
        const users = await executeQuery('SELECT * FROM users WHERE id = ? AND refresh_token = ?', [decoded.id, token]);
        if (users.length === 0) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }
        const user = users[0];
        const tokens = generateTokens(user);
        await executeQuery('UPDATE users SET refresh_token = ? WHERE id = ?', [tokens.refreshToken, user.id]);
        res.json(tokens);
    } catch (error) {
        res.status(403).json({ message: 'Invalid refresh token', error: String(error) });
    }
};
