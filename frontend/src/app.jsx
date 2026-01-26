import { useState, useEffect } from 'preact/hooks';
import Router, { route } from 'preact-router';
import { JobsList, PostJob } from './pages/Jobs';
import { Applications } from './pages/Applications';
import JobSeekersImg from './assets/Job_Seekers.png';
import { AuthModal } from './AuthModal';
import './app.css';
import './home.css';

// Pages
const Home = ({ user, openAuth }) => (
  <div class="home-container">
    <div class="home-left">
      <img src={JobSeekersImg} alt="Job Seekers" class="hero-image" />
    </div>
    <div class="divider"></div>
    <div class="home-right">
      <h1>Welcome to Sankett's Job Portal</h1>
      <p>Find your dream job or post an opening.</p>
      <div class="actions">
        {!user && <button onClick={openAuth}>Login</button>}
        <a href="/jobs"><button>Browse Jobs</button></a>
      </div>
    </div>
  </div>
);

// Main App
export function App() {
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthModalOpen(false); // Close modal on successful login
    route('/jobs');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    route('/');
  };

  return (
    <div id="app">
      <header>
        <a href="/" class="logo">Sankett's Job Portal</a>
        <nav>
          <a href="/">Home</a>
          <a href="/jobs">Jobs</a>
          {user ? (
            <>
              {user.role === 'POSTER' && <a href="/post-job">Post Job</a>}
              {user.role === 'SEEKER' && <a href="/applications">My Apps</a>}
              <span style={{ marginLeft: '1rem', color: 'var(--text)' }}>Hi, {user.username}</span>
              <button onClick={handleLogout} style={{ marginLeft: '1rem' }}>Logout</button>
            </>
          ) : (
            <button onClick={() => setIsAuthModalOpen(true)}>Login</button>
          )}
        </nav>
      </header>
      <main>
        <Router>
          <Home path="/" user={user} openAuth={() => setIsAuthModalOpen(true)} />
          <JobsList path="/jobs" user={user} />
          <PostJob path="/post-job" user={user} />
          <Applications path="/applications" user={user} />
        </Router>
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}
