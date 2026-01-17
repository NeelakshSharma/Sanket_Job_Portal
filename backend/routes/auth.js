import express from 'express';
import { initializeDatabase } from '../init_db.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const db = await initializeDatabase();
        await db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, password, role]);
        const user = await db.get('SELECT id, username, role FROM users WHERE username = ?', [username]);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const db = await initializeDatabase();
        const user = await db.get('SELECT id, username, role FROM users WHERE username = ? AND password = ?', [username, password]);
        if (user) {
            res.json(user);
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
