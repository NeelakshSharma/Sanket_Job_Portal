import { useState, useEffect } from 'preact/hooks';
import Router, { route } from 'preact-router';
import { JobsList, PostJob } from './pages/Jobs';
import { Applications } from './pages/Applications';
import './app.css';

// Pages
const Home = ({ user }) => (
  <div class="container">
    <h1>Welcome to Sanket Job Portal</h1>
    <p>Find your dream job or post an opening.</p>
    <div class="actions">
      {!user && <a href="/login"><button>Login</button></a>}
      <a href="/jobs"><button>Browse Jobs</button></a>
    </div>
  </div>
);

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data);
        route('/jobs');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div class="container">
      <h2>Login</h2>
      {error && <p class="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onInput={e => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onInput={e => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <a href="/register">Register</a></p>
    </div>
  );
};

const Register = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('SEEKER');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role })
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data);
        route('/jobs');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div class="container">
      <h2>Register</h2>
      {error && <p class="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onInput={e => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onInput={e => setPassword(e.target.value)} required />
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="SEEKER">Job Seeker</option>
          <option value="POSTER">Employer</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

// Main App
export function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    route('/');
  };

  return (
    <div id="app">
      <header>
        <nav>
          <a href="/">Home</a>
          <a href="/jobs">Jobs</a>
          {user ? (
            <>
              {user.role === 'POSTER' && <a href="/post-job">Post Job</a>}
              {user.role === 'SEEKER' && <a href="/applications">My Apps</a>}
              <span>Hi, {user.username}</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <a href="/login">Login</a>
          )}
        </nav>
      </header>
      <main>
        <Router>
          <Home path="/" user={user} />
          <Login path="/login" onLogin={handleLogin} />
          <Register path="/register" onLogin={handleLogin} />
          <JobsList path="/jobs" user={user} />
          <PostJob path="/post-job" user={user} />
          <Applications path="/applications" user={user} />
        </Router>
      </main>
    </div>
  );
}
