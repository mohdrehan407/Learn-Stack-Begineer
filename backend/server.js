const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../lms.db'));
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'STUDENT',
    refresh_token TEXT
  );
  CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    order_index INTEGER DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    section_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    video_url TEXT NOT NULL,
    duration INTEGER DEFAULT 0,
    order_index INTEGER DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS enrollments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    subject_id INTEGER NOT NULL,
    UNIQUE(user_id, subject_id)
  );
  CREATE TABLE IF NOT EXISTS video_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    video_id INTEGER NOT NULL,
    progress_seconds INTEGER DEFAULT 0,
    is_completed INTEGER DEFAULT 0,
    UNIQUE(user_id, video_id)
  );
`);

// Seed data
const cnt = db.prepare('SELECT COUNT(*) as c FROM subjects').get().c;
if (cnt === 0) {
    const hash = bcrypt.hashSync('password', 10);
    db.prepare("INSERT OR IGNORE INTO users(name,email,password,role)VALUES('Admin','admin@lms.com',?,'ADMIN')").run(hash);
    db.prepare("INSERT OR IGNORE INTO users(name,email,password,role)VALUES('Student','student@lms.com',?,'STUDENT')").run(hash);
    db.prepare("INSERT INTO subjects(title,description,order_index)VALUES('Full-Stack Web Development','Learn Next.js and Node.js from scratch',1)").run();
    db.prepare("INSERT INTO subjects(title,description,order_index)VALUES('Data Science with Python','Learn Pandas, NumPy, and Machine Learning',2)").run();
    db.prepare("INSERT INTO sections(subject_id,title,order_index)VALUES(1,'Introduction to React & Next.js',1)").run();
    db.prepare("INSERT INTO sections(subject_id,title,order_index)VALUES(1,'Advanced Next.js Concepts',2)").run();
    db.prepare("INSERT INTO sections(subject_id,title,order_index)VALUES(2,'Python Basics',1)").run();
    db.prepare("INSERT INTO videos(section_id,title,video_url,duration,order_index)VALUES(1,'What is Next.js?','https://www.youtube.com/watch?v=Sklc_fQBmcs',600,1)").run();
    db.prepare("INSERT INTO videos(section_id,title,video_url,duration,order_index)VALUES(1,'Routing in Next.js','https://www.youtube.com/watch?v=wm5gMKuwSYk',800,2)").run();
    db.prepare("INSERT INTO videos(section_id,title,video_url,duration,order_index)VALUES(2,'Server Actions','https://www.youtube.com/watch?v=dDpZfOQBMaU',1200,1)").run();
    db.prepare("INSERT INTO videos(section_id,title,video_url,duration,order_index)VALUES(3,'Python Hello World','https://www.youtube.com/watch?v=kqtD5dpn9C8',400,1)").run();
    console.log('Demo data seeded successfully.');
}

const JWT_SECRET = 'lms-jwt-secret-2024';
const JWT_REFRESH = 'lms-refresh-secret-2024';

const app = express();
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Auth middleware
const auth = (req, res, next) => {
    const header = req.headers['authorization'];
    const token = header && header.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Auth required' });
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') return next();
    return res.status(403).json({ message: 'Admin only' });
};

// Routes
app.get('/health', (req, res) => res.json({ status: 'ok', message: 'LMS API is running' }));

app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (existing) return res.status(400).json({ message: 'User already exists' });
        const hashed = await bcrypt.hash(password, 10);
        const result = db.prepare('INSERT INTO users(name, email, password) VALUES(?, ?, ?)').run(name, email, hashed);
        res.status(201).json({ message: 'User registered successfully', userId: result.lastInsertRowid });
    } catch (e) {
        console.error('Register error:', e);
        res.status(500).json({ message: 'Error registering user', error: String(e) });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
        const accessToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH, { expiresIn: '7d' });
        db.prepare('UPDATE users SET refresh_token = ? WHERE id = ?').run(refreshToken, user.id);
        res.json({ accessToken, refreshToken, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (e) {
        console.error('Login error:', e);
        res.status(500).json({ message: 'Error logging in', error: String(e) });
    }
});

app.post('/api/auth/refresh', (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(401).json({ message: 'Refresh token required' });
        const decoded = jwt.verify(token, JWT_REFRESH);
        const user = db.prepare('SELECT * FROM users WHERE id = ? AND refresh_token = ?').get(decoded.id, token);
        if (!user) return res.status(403).json({ message: 'Invalid refresh token' });
        const accessToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH, { expiresIn: '7d' });
        db.prepare('UPDATE users SET refresh_token = ? WHERE id = ?').run(refreshToken, user.id);
        res.json({ accessToken, refreshToken });
    } catch (e) {
        res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
});

app.get('/api/courses', auth, (req, res) => {
    const subjects = db.prepare('SELECT * FROM subjects ORDER BY order_index ASC').all();
    res.json(subjects);
});

app.get('/api/courses/dashboard', auth, (req, res) => {
    const subjects = db.prepare('SELECT s.* FROM subjects s JOIN enrollments e ON s.id = e.subject_id WHERE e.user_id = ?').all(req.user.id);
    res.json({ subjects });
});

app.get('/api/courses/:id', auth, (req, res) => {
    const uid = req.user.id;
    const sid = req.params.id;
    const subject = db.prepare('SELECT * FROM subjects WHERE id = ?').get(sid);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    const enrolled = db.prepare('SELECT id FROM enrollments WHERE user_id = ? AND subject_id = ?').get(uid, sid);
    const sections = db.prepare('SELECT * FROM sections WHERE subject_id = ? ORDER BY order_index ASC').all(sid);
    const videos = db.prepare(`
    SELECT v.*, vp.progress_seconds, vp.is_completed
    FROM videos v
    LEFT JOIN video_progress vp ON v.id = vp.video_id AND vp.user_id = ?
    WHERE v.section_id IN (SELECT id FROM sections WHERE subject_id = ?)
    ORDER BY v.order_index ASC
  `).all(uid, sid);
    subject.sections = sections.map(sec => ({ ...sec, videos: videos.filter(v => v.section_id === sec.id) }));
    subject.isEnrolled = !!enrolled;
    res.json(subject);
});

app.post('/api/courses/:id/enroll', auth, (req, res) => {
    try {
        db.prepare('INSERT OR IGNORE INTO enrollments(user_id, subject_id) VALUES(?, ?)').run(req.user.id, req.params.id);
        res.json({ message: 'Enrolled successfully' });
    } catch (e) {
        res.status(500).json({ message: 'Enrollment error', error: String(e) });
    }
});

app.post('/api/progress/save', auth, (req, res) => {
    try {
        const { videoId, progressSeconds, isCompleted } = req.body;
        const uid = req.user.id;
        const cv = isCompleted ? 1 : 0;
        const existing = db.prepare('SELECT id FROM video_progress WHERE user_id = ? AND video_id = ?').get(uid, videoId);
        if (existing) {
            db.prepare('UPDATE video_progress SET progress_seconds = ?, is_completed = MAX(is_completed, ?) WHERE user_id = ? AND video_id = ?').run(progressSeconds, cv, uid, videoId);
        } else {
            db.prepare('INSERT INTO video_progress(user_id, video_id, progress_seconds, is_completed) VALUES(?, ?, ?, ?)').run(uid, videoId, progressSeconds, cv);
        }
        res.json({ message: 'Progress saved' });
    } catch (e) {
        res.status(500).json({ message: 'Progress error', error: String(e) });
    }
});

app.post('/api/admin/subjects', auth, isAdmin, (req, res) => {
    const { title, description, orderIndex } = req.body;
    const r = db.prepare('INSERT INTO subjects(title, description, order_index) VALUES(?, ?, ?)').run(title, description || '', orderIndex || 0);
    res.json({ message: 'Subject created', id: r.lastInsertRowid });
});

app.post('/api/admin/sections', auth, isAdmin, (req, res) => {
    const { subjectId, title, orderIndex } = req.body;
    const r = db.prepare('INSERT INTO sections(subject_id, title, order_index) VALUES(?, ?, ?)').run(subjectId, title, orderIndex || 0);
    res.json({ message: 'Section created', id: r.lastInsertRowid });
});

app.post('/api/admin/videos', auth, isAdmin, (req, res) => {
    const { sectionId, title, videoUrl, duration, orderIndex } = req.body;
    const r = db.prepare('INSERT INTO videos(section_id, title, video_url, duration, order_index) VALUES(?, ?, ?, ?, ?)').run(sectionId, title, videoUrl, duration || 0, orderIndex || 0);
    res.json({ message: 'Video created', id: r.lastInsertRowid });
});

app.put('/api/admin/reorder', auth, isAdmin, (req, res) => {
    const { table, items } = req.body;
    if (!['subjects', 'sections', 'videos'].includes(table)) return res.status(400).json({ message: 'Invalid table' });
    for (const item of items) {
        db.prepare(`UPDATE ${table} SET order_index = ? WHERE id = ?`).run(item.orderIndex, item.id);
    }
    res.json({ message: 'Order updated' });
});

app.get('/api/admin/stats', auth, isAdmin, (req, res) => {
    res.json({
        users: db.prepare('SELECT COUNT(*) as c FROM users').get().c,
        subjects: db.prepare('SELECT COUNT(*) as c FROM subjects').get().c,
        enrollments: db.prepare('SELECT COUNT(*) as c FROM enrollments').get().c
    });
});

app.listen(5000, () => {
    console.log('✅ LMS Server running at http://localhost:5000');
    console.log('📚 Demo logins: admin@lms.com / password | student@lms.com / password');
});
