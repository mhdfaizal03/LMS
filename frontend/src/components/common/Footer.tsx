import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Heart, Github, Twitter, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        padding: '3rem 1.5rem 2rem',
        marginTop: 'auto',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, var(--primary), #818cf8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <GraduationCap size={20} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                Edu<span style={{ color: 'var(--primary)' }}>Pulse</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              A modern, intuitive learning platform designed for ambitious learners, creators, and institutions worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>Explore</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <li><Link to="/courses" style={{ color: 'var(--text-secondary)' }}>All Courses</Link></li>
              <li><Link to="/courses?category_id=1" style={{ color: 'var(--text-secondary)' }}>Web Development</Link></li>
              <li><Link to="/courses?category_id=2" style={{ color: 'var(--text-secondary)' }}>AI & Machine Learning</Link></li>
              <li><Link to="/courses?category_id=3" style={{ color: 'var(--text-secondary)' }}>Cloud & DevOps</Link></li>
            </ul>
          </div>

          {/* Verification & Support */}
          <div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>Credentials</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <li><Link to="/verify-certificate" style={{ color: 'var(--text-secondary)' }}>Verify Certificate Code</Link></li>
              <li><Link to="/register?role=instructor" style={{ color: 'var(--text-secondary)' }}>Teach on EduPulse</Link></li>
              <li><Link to="/login" style={{ color: 'var(--text-secondary)' }}>Student Sign In</Link></li>
            </ul>
          </div>

          {/* Platform Status */}
          <div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>Platform Status</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)' }} />
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>All Systems Operational</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              High-availability learning cloud infrastructure
            </p>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.8125rem',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} EduPulse LMS Platform. All rights reserved.
          </div>
          <div>
            Interactive Education & Skill Certification
          </div>
        </div>
      </div>
    </footer>
  );
};
