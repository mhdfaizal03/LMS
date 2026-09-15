import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { analyticsApi, enrollmentApi } from '../../api';
import { StudentDashboardStats, Enrollment } from '../../types';
import { LectureSidebar } from '../../components/lecture/LectureSidebar';
import { LectureClassCard, ClassCardData } from '../../components/lecture/LectureClassCard';
import { LectureTaskList } from '../../components/lecture/LectureTaskList';
import { LectureCalendar } from '../../components/lecture/LectureCalendar';
import { LectureUpcoming } from '../../components/lecture/LectureUpcoming';
import { Search, ChevronDown, User as UserIcon, LogOut, Settings } from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const [activeNavTab, setActiveNavTab] = useState<string>('classes');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);

  const [stats, setStats] = useState<StudentDashboardStats | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    analyticsApi.getStudentStats()
      .then((data) => setStats(data))
      .catch(console.error);

    enrollmentApi.getMyCourses()
      .then((data) => setEnrollments(data))
      .catch(console.error);
  }, []);

  // Class Cards data exactly matching the design mockup
  const classCards: ClassCardData[] = [
    {
      id: 'biography',
      title: 'Biography',
      taskCountText: '4 Task Remaining',
      theme: 'mint',
      hasBadgeDot: true,
    },
    {
      id: 'math',
      title: 'Math',
      taskCountText: '3 Task Remaining',
      theme: 'yellow',
      hasBadgeDot: true,
    },
    {
      id: 'psychology',
      title: 'Psychology',
      taskCountText: 'No assignment yet',
      theme: 'purple',
      hasBadgeDot: false,
    },
  ];

  const handleViewTasks = (classId: string) => {
    showToast(`Viewing tasks for ${classId.toUpperCase()}`, 'info');
  };

  return (
    <div className="lecture-container">
      {/* 1. LEFT SIDEBAR */}
      <LectureSidebar activeTab={activeNavTab} onTabChange={setActiveNavTab} />

      {/* 2. MAIN CENTER CONTENT */}
      <main style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto', minWidth: 0 }}>
        {/* Top Header: My Classes . */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'inherit' }}>
            My Classes<span className="lecture-dot">.</span>
          </h1>
        </div>

        {/* 3 Pastel Class Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          {classCards.map((card) => (
            <LectureClassCard
              key={card.id}
              card={card}
              onViewTasks={handleViewTasks}
            />
          ))}
        </div>

        {/* Today Tasks Section with Filter Tabs & Task Rows */}
        <LectureTaskList />
      </main>

      {/* 3. RIGHT SIDEBAR PANEL */}
      <aside className="lecture-right-panel">
        {/* Search & User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          {/* Search input */}
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', top: '10px', left: '14px' }} />
            <input
              type="text"
              placeholder="Search for anythings . ."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#f8fafc',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                padding: '8px 12px 8px 38px',
                fontSize: '0.8125rem',
                color: '#1e293b',
                outline: 'none',
              }}
            />
          </div>

          {/* User Profile Avatar with dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #fbcfe8, #f472b6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                }}
              >
                {/* Cute avatar illustration */}
                <span style={{ fontSize: '1.25rem' }}>👩‍🎓</span>
              </div>
              <ChevronDown size={14} color="#64748b" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div
                className="card"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '46px',
                  width: '200px',
                  padding: '8px',
                  zIndex: 100,
                  boxShadow: 'var(--shadow-xl)',
                }}
              >
                <div style={{ padding: '8px', borderBottom: '1px solid var(--border-color)', marginBottom: '4px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{user?.name || 'Emma Watson'}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{user?.email || 'emma.student@lms.com'}</div>
                </div>
                <button
                  onClick={() => {
                    navigate('/student/profile');
                    setShowProfileMenu(false);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    border: 'none',
                    background: 'transparent',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <Settings size={14} /> Profile & Settings
                </button>
                <button
                  onClick={logout}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    border: 'none',
                    background: 'transparent',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'var(--danger)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mini Calendar Card */}
        <LectureCalendar />

        {/* Upcoming Timeline Events */}
        <LectureUpcoming />
      </aside>
    </div>
  );
};
