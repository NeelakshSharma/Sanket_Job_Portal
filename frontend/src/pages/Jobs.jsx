import { useState, useEffect } from 'preact/hooks';
import { route } from 'preact-router';

export const JobsList = ({ user }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/jobs')
            .then(res => res.json())
            .then(data => {
                setJobs(data);
                setLoading(false);
            })
            .catch(err => setLoading(false));
    }, []);

    const handleApply = async (jobId) => {
        if (!user) return route('/login');
        try {
            const res = await fetch('/api/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobId, seekerId: user.id })
            });
            if (res.ok) {
                alert('Applied successfully!');
            } else {
                const d = await res.json();
                alert(d.error);
            }
        } catch (e) {
            alert('Error applying');
        }
    };

    const deleteJob = async (id) => {
        if (!confirm('Delete job?')) return;
        try {
            await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
            setJobs(jobs.filter(j => j.id !== id));
        } catch (e) {
            alert('Error deleting');
        }
    };

    if (loading) return <p>Loading jobs...</p>;

    return (
        <div class="container">
            <h2>Available Jobs</h2>
            <div class="job-list">
                {jobs.length === 0 ? <p>No jobs found.</p> : jobs.map(job => (
                    <div class="card" key={job.id}>
                        <h3>{job.title}</h3>
                        <h4>{job.company}</h4>
                        <p><strong>Location:</strong> {job.location}</p>
                        <p><strong>Salary:</strong> {job.salary}</p>
                        <p>{job.description}</p>
                        {user && user.role === 'SEEKER' && (
                            <button onClick={() => handleApply(job.id)}>Apply Now</button>
                        )}
                        {user && user.role === 'POSTER' && user.id === job.poster_id && (
                            <button onClick={() => deleteJob(job.id)} class="danger">Delete</button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export const PostJob = ({ user }) => {
    if (!user || user.role !== 'POSTER') return <p>Unauthorized</p>;

    const [form, setForm] = useState({ title: '', company: '', location: '', description: '', salary: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, posterId: user.id })
            });
            if (res.ok) {
                route('/jobs');
            } else {
                alert('Failed to post job');
            }
        } catch (e) {
            alert('Error posting job');
        }
    };

    return (
        <div class="container">
            <h2>Post a Job</h2>
            <form onSubmit={handleSubmit}>
                <input placeholder="Title" value={form.title} onInput={e => setForm({ ...form, title: e.target.value })} required />
                <input placeholder="Company" value={form.company} onInput={e => setForm({ ...form, company: e.target.value })} required />
                <input placeholder="Location" value={form.location} onInput={e => setForm({ ...form, location: e.target.value })} required />
                <input placeholder="Salary" value={form.salary} onInput={e => setForm({ ...form, salary: e.target.value })} />
                <textarea placeholder="Description" value={form.description} onInput={e => setForm({ ...form, description: e.target.value })} required />
                <button type="submit">Post Job</button>
            </form>
        </div>
    );
};
