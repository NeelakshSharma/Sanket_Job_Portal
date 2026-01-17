import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './init_db.js';
import authRoutes from './routes/auth.js';
import jobRoutes from './routes/jobs.js';
import applicationRoutes from './routes/applications.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/apply', applicationRoutes); // Fix mount point based on API spec if needed, but spec says POST /api/apply
// Actually spec says:
// 1. POST /api/register
// 2. POST /api/login
// 3. GET /api/jobs
// ...
// 7. POST /api/apply
// 8. GET /api/my-applications
// 9. GET /api/jobs/:id/applicants

// My mounting:
// /api/register comes from authRoutes which has /register -> /api/register. Correct.
// /api/jobs comes from jobRoutes. Correct.
// /api/apply... applicationRoutes has POST / -> /api/apply/. Correct.
// But applicationRoutes also has GET /my-applications -> /api/apply/my-applications. WRONG. Spec says /api/my-applications.
// And GET /api/jobs/:id/applicants. This is in jobRoutes ideally or exposed via /api/jobs.

// I need to adjust mounting or routes.
// Let's adjust server.js to logical mounting or specific routes.

// Better strategy: mount specific paths or use router logic carefully.
// Re-impl server.js below.

let db;

async function startServer() {
    try {
        db = await initializeDatabase();

        app.get('/', (req, res) => {
            res.send('Job Portal Backend Running');
        });

        // Mount routes
        app.use('/api', authRoutes); // /api/register, /api/login
        app.use('/api/jobs', jobRoutes); // /api/jobs, /api/jobs/my-posts, /api/jobs/:id

        // For applications, it's mixed.
        // POST /api/apply
        // GET /api/my-applications

        // I will put these in a general router or specific mount points.
        // Or I can mount applicationRoutes at /api and change the paths inside it.
        app.use('/api', applicationRoutes);

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
