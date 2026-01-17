import express from 'express';
import { initializeDatabase } from '../init_db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const db = await initializeDatabase();
        const jobs = await db.all('SELECT * FROM jobs');
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/my-posts', async (req, res) => {
    const { posterId } = req.query;
    try {
        const db = await initializeDatabase();
        const jobs = await db.all('SELECT * FROM jobs WHERE poster_id = ?', [posterId]);
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    const { posterId, title, company, location, description, salary } = req.body;

    try {
        const db = await initializeDatabase();
        // Verify poster
        const user = await db.get('SELECT role FROM users WHERE id = ?', [posterId]);
        if (!user || user.role !== 'POSTER') {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const result = await db.run(
            'INSERT INTO jobs (poster_id, title, company, location, description, salary) VALUES (?, ?, ?, ?, ?, ?)',
            [posterId, title, company, location, description, salary]
        );
        res.status(201).json({ id: result.lastID });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const db = await initializeDatabase();
        await db.run('DELETE FROM jobs WHERE id = ?', [id]);
        res.json({ message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
