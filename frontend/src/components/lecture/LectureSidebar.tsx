import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutGrid, BookOpen, MessageSquare, FileText, Calendar,
  Power, GraduationCap
} from 'lucide-react';

interface LectureSidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const LectureSidebar: React.FC<LectureSidebarProps> = ({ activeTab = 'classes', onTabChange }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="lecture-sidebar">
      {/* Brand */}
      <div>
        <div className="lecture-brand">
          Lecture<span className="lecture-dot">.</span>
        </div>
      </div>

      {/* Institute Badge */}
      <div className="institute-card">
        <div className="institute-icon">
          <GraduationCap size={22} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'inherit', lineHeight: 1.2 }}>
            Institute of Sam
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
            First year
          </div>
        </div>
      </div>

      {/* Navigation Group 1 */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <button
          onClick={() => onTabChange ? onTabChange('dashboard') : navigate('/student')}
          className={`lecture-nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
        >
          <LayoutGrid size={18} />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => onTabChange ? onTabChange('classes') : navigate('/student')}
          className={`lecture-nav-link ${activeTab === 'classes' ? 'active' : ''}`}
        >
          <BookOpen size={18} />
          <span>Classes</span>
        </button>

        <button
          onClick={() => onTabChange ? onTabChange('discussions') : navigate('/student')}
          className={`lecture-nav-link ${activeTab === 'discussions' ? 'active' : ''}`}
        >
          <MessageSquare size={18} />
          <span>Discussions</span>
        </button>
      </nav>

      {/* Navigation Group 2 - Insight */}
      <div style={{ marginTop: '0.5rem' }}>
        <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'inherit', marginBottom: '0.75rem', paddingLeft: '8px' }}>
          Insight<span className="lecture-dot">.</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <button
            onClick={() => onTabChange ? onTabChange('resources') : navigate('/courses')}
            className={`lecture-nav-link ${activeTab === 'resources' ? 'active' : ''}`}
          >
            <FileText size={18} />
            <span>Resources</span>
          </button>

          <button
            onClick={() => onTabChange ? onTabChange('schedule') : navigate('/student')}
            className={`lecture-nav-link ${activeTab === 'schedule' ? 'active' : ''}`}
          >
            <Calendar size={18} />
            <span>My Schedule</span>
          </button>
        </nav>
      </div>

      {/* Logout at Bottom */}
      <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
        <button
          onClick={logout}
          className="lecture-nav-link"
          style={{ color: '#64748b' }}
        >
          <Power size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
