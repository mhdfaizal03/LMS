import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, getRoleHome } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { GraduationCap, Mail, Lock, LogIn } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { user, isLoading, login } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // If already authenticated, redirect to appropriate role area
  useEffect(() => {
    if (user && !isLoading) {
      navigate(getRoleHome(user.role), { replace: true });
    }
  }, [user, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const loggedInUser = await login({ email, password });
      showToast('Logged in successfully!', 'success');
      
      const requestedPath = (location.state as any)?.from?.pathname;
      if (requestedPath && !['/login', '/register', '/dashboard'].includes(requestedPath)) {
        navigate(requestedPath, { replace: true });
      } else {
        navigate(getRoleHome(loggedInUser.role), { replace: true });
      }
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Invalid email or password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 68px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
      }}
    >
      <div className="card glass-card" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem' }}>
        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--primary), #818cf8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              margin: '0 auto 1rem',
            }}
          >
            <GraduationCap size={28} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Welcome Back</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Sign in to continue your learning journey
          </p>
        </div>

        {/* Demo Credentials Quick Fill Buttons */}
        <div
          style={{
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textAlign: 'center' }}>
            ⚡ QUICK DEMO LOGINS
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            <button
              type="button"
              onClick={() => fillDemo('admin@lms.com', 'Admin@123456')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '4px' }}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => fillDemo('sarah.instructor@lms.com', 'Instructor@123')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '4px' }}
            >
              Instructor
            </button>
            <button
              type="button"
              onClick={() => fillDemo('emma.student@lms.com', 'Student@123')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '4px' }}
            >
              Student
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', top: '12px', left: '14px' }} />
              <input
                type="email"
                required
                className="form-input"
                placeholder="name@domain.com"
                style={{ paddingLeft: '42px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', top: '12px', left: '14px' }} />
              <input
                type="password"
                required
                className="form-input"
                placeholder="••••••••"
                style={{ paddingLeft: '42px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.75rem' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'} <LogIn size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};
