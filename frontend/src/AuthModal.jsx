import { useState } from 'preact/hooks';
import './AuthModal.css';

export function AuthModal({ isOpen, onClose, onLogin }) {
    if (!isOpen) return null;

    const [mode, setMode] = useState('LOGIN'); // 'LOGIN' or 'REGISTER'
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'SEEKER'
    });
    const [error, setError] = useState('');

    const handleInput = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = mode === 'LOGIN' ? '/api/login' : '/api/register';
        const body = mode === 'LOGIN'
            ? { username: formData.username, password: formData.password }
            : formData;

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();

            if (res.ok) {
                onLogin(data);
                onClose();
                // Reset form
                setFormData({ username: '', password: '', role: 'SEEKER' });
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError(mode === 'LOGIN' ? 'Login failed' : 'Registration failed');
        }
    };

    return (
        <div class="modal-overlay" onClick={onClose}>
            <div class="modal-content" onClick={e => e.stopPropagation()}>
                <button class="modal-close" onClick={onClose}>&times;</button>

                <div class="auth-tabs">
                    <button
                        class={`auth-tab ${mode === 'LOGIN' ? 'active' : ''}`}
                        onClick={() => switchMode('LOGIN')}
                    >
                        Login
                    </button>
                    <button
                        class={`auth-tab ${mode === 'REGISTER' ? 'active' : ''}`}
                        onClick={() => switchMode('REGISTER')}
                    >
                        Register
                    </button>
                </div>

                {error && <p class="error">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onInput={handleInput}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onInput={handleInput}
                        required
                    />

                    {mode === 'REGISTER' && (
                        <select name="role" value={formData.role} onChange={handleInput}>
                            <option value="SEEKER">Job Seeker</option>
                            <option value="POSTER">Employer</option>
                        </select>
                    )}

                    <button type="submit">
                        {mode === 'LOGIN' ? 'Login' : 'Register'}
                    </button>
                </form>
            </div>
        </div>
    );
}
