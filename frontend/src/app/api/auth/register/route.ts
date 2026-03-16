import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { executeQuery } from '../../../../lib/db';

export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const existingUsers = await executeQuery('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await executeQuery(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        return NextResponse.json(
            { message: 'User registered successfully', userId: result.insertId },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Register error:', error);
        return NextResponse.json(
            {
                message: 'Error registering user',
                error: error.message,
                code: error.code,
                hint: 'Missing database connection. Please set DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME in Vercel Environment Variables.'
            },
            { status: 500 }
        );
    }
}
