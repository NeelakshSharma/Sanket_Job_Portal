import { useState, useEffect } from 'preact/hooks';

export const Applications = ({ user }) => {
    if (!user || user.role !== 'SEEKER') return <p>Access Denied</p>;

    const [apps, setApps] = useState([]);

    useEffect(() => {
        fetch(`/api/my-applications?seekerId=${user.id}`)
            .then(res => res.json())
            .then(setApps)
            .catch(console.error);
    }, [user.id]);

    return (
        <div class="container">
            <h2>My Applications</h2>
            {apps.length === 0 ? <p>No applications yet.</p> : (
                <table>
                    <thead>
                        <tr>
                            <th>Job Title</th>
                            <th>Company</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {apps.map(a => (
                            <tr key={a.id}>
                                <td>{a.title}</td>
                                <td>{a.company}</td>
                                <td>{a.status}</td>
                                <td>{new Date(a.applied_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};
