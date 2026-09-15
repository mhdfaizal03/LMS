import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Home, Search, LineChart, BookOpen, Users, PieChart,
  CheckSquare, Plus, Zap, MessageSquare, Settings
} from 'lucide-react';

interface TrenningIconRailProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onOpenAI?: () => void;
}

export const TrenningIconRail: React.FC<TrenningIconRailProps> = ({
  activeTab = 'content',
  onTabChange,
  onOpenAI,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="trenning-icon-rail">
      {/* Brand Icon */}
      <div
        onClick={() => navigate('/')}
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontWeight: 800,
          fontSize: '1.25rem',
          cursor: 'pointer',
          boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)',
        }}
      >
        t<span style={{ color: '#fbbf24' }}>.</span>
      </div>

      {/* Main Nav Items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={() => onTabChange ? onTabChange('home') : navigate('/student')}
          className={`trenning-rail-btn ${activeTab === 'home' ? 'active' : ''}`}
          title="Home"
        >
          <Home size={18} />
        </button>

        <button
          onClick={() => onTabChange ? onTabChange('search') : navigate('/courses')}
          className={`trenning-rail-btn ${activeTab === 'search' ? 'active' : ''}`}
          title="Search Courses"
        >
          <Search size={18} />
        </button>

        <button
          onClick={() => onTabChange ? onTabChange('analytics') : navigate('/instructor/analytics')}
          className={`trenning-rail-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          title="Analytics"
        >
          <LineChart size={18} />
        </button>

        <button
          onClick={() => onTabChange ? onTabChange('content') : navigate('/instructor/courses')}
          className={`trenning-rail-btn ${activeTab === 'content' ? 'active' : ''}`}
          title="Learning Content"
        >
          <BookOpen size={18} />
        </button>

        <button
          onClick={() => onTabChange ? onTabChange('users') : navigate('/lms/admin/users')}
          className={`trenning-rail-btn ${activeTab === 'users' ? 'active' : ''}`}
          title="Community & Users"
        >
          <Users size={18} />
        </button>

        <button
          onClick={() => onTabChange ? onTabChange('reports') : navigate('/instructor/analytics')}
          className={`trenning-rail-btn ${activeTab === 'reports' ? 'active' : ''}`}
          title="Reports"
        >
          <PieChart size={18} />
        </button>

        <button
          onClick={() => onTabChange ? onTabChange('tasks') : navigate('/instructor/assignments')}
          className={`trenning-rail-btn ${activeTab === 'tasks' ? 'active' : ''}`}
          title="Assignments & Tasks"
        >
          <CheckSquare size={18} />
        </button>
      </nav>

      {/* Bottom Tools & Profile */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        {/* Quick Add Button */}
        <button
          onClick={() => onOpenAI?.()}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: '#4338ca',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(67, 56, 202, 0.3)',
          }}
          title="Create or Ask AI"
        >
          <Plus size={18} />
        </button>

        {/* AI Zap */}
        <button
          onClick={() => onOpenAI?.()}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: '#fef3c7',
            color: '#d97706',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
          }}
          title="AI Assistant"
        >
          <Zap size={16} fill="#f59e0b" />
        </button>

        <button
          onClick={() => onTabChange?.('discussions')}
          className="trenning-rail-btn"
          title="Discussions"
        >
          <MessageSquare size={18} />
        </button>

        <button
          onClick={() => navigate('/student/profile')}
          className="trenning-rail-btn"
          title="Settings"
        >
          <Settings size={18} />
        </button>

        {/* User Initials Avatar */}
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: '#fde68a',
            color: '#78350f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.75rem',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/student/profile')}
          title={user?.name || 'Account'}
        >
          {user ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'RF'}
        </div>
      </div>
    </div>
  );
};
