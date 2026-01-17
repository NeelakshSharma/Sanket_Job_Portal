import express from 'express';
import { initializeDatabase } from '../init_db.js';

const router = express.Router();

router.post('/apply', async (req, res) => {
    const { jobId, seekerId } = req.body;

    try {
        const db = await initializeDatabase();

        // Check duplicate
        const existing = await db.get('SELECT id FROM applications WHERE job_id = ? AND seeker_id = ?', [jobId, seekerId]);
        if (existing) {
            return res.status(400).json({ error: 'Already applied' });
        }

        await db.run('INSERT INTO applications (job_id, seeker_id) VALUES (?, ?)', [jobId, seekerId]);
        res.status(201).json({ message: 'Applied' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/my-applications', async (req, res) => {
    const { seekerId } = req.query;
    try {
        const db = await initializeDatabase();
        const apps = await db.all(`
      SELECT a.*, j.title, j.company 
      FROM applications a 
      JOIN jobs j ON a.job_id = j.id 
      WHERE a.seeker_id = ?
    `, [seekerId]);
        res.json(apps);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/jobs/:id/applicants', async (req, res) => {
    const { id } = req.params;
    try {
        const db = await initializeDatabase();
        const applicants = await db.all(`
      SELECT u.username, u.id as user_id, a.status, a.applied_at 
      FROM applications a 
      JOIN users u ON a.seeker_id = u.id 
      WHERE a.job_id = ?
    `, [id]);
        res.json(applicants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
