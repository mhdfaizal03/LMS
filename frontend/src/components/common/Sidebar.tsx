import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, BookOpen, Award, UserCheck, Layers, FileCheck,
  BarChart3, Settings, ShieldCheck, FolderTree, History, PlusCircle
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  const isStudent = user.role === 'student';
  const isInstructor = user.role === 'instructor';
  const isAdmin = user.role === 'admin' || user.role === 'superadmin';

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-color)',
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        minHeight: 'calc(100vh - 68px)',
      }}
    >
      <div style={{ padding: '0 0.5rem 0.75rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {isAdmin ? 'Admin Console' : isInstructor ? 'Instructor Studio' : 'Student Portal'}
      </div>

      {/* Student Nav */}
      {isStudent && (
        <>
          <NavLink
            to="/student"
            end
            className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
            style={{ justifyContent: 'flex-start', border: 'none', padding: '10px 14px' }}
          >
            <LayoutDashboard size={18} /> Overview
          </NavLink>
          <NavLink
            to="/student/courses"
            className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
            style={{ justifyContent: 'flex-start', border: 'none', padding: '10px 14px' }}
          >
            <BookOpen size={18} /> My Courses
          </NavLink>
          <NavLink
            to="/student/certificates"
            className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
            style={{ justifyContent: 'flex-start', border: 'none', padding: '10px 14px' }}
          >
            <Award size={18} /> Certificates
          </NavLink>
          <NavLink
            to="/student/profile"
            className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
            style={{ justifyContent: 'flex-start', border: 'none', padding: '10px 14px' }}
          >
            <Settings size={18} /> Profile & Settings
          </NavLink>
        </>
      )}

      {/* Instructor Nav */}
      {isInstructor && (
        <>
          <NavLink
            to="/instructor"
            end
            className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
            style={{ justifyContent: 'flex-start', border: 'none', padding: '10px 14px' }}
          >
            <LayoutDashboard size={18} /> Overview
          </NavLink>
          <NavLink
            to="/instructor/courses"
            className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
            style={{ justifyContent: 'flex-start', border: 'none', padding: '10px 14px' }}
          >
            <BookOpen size={18} /> My Courses
          </NavLink>
          <NavLink
            to="/instructor/courses/new"
            className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
            style={{ justifyContent: 'flex-start', border: 'none', padding: '10px 14px' }}
          >
            <PlusCircle size={18} /> Create Course
          </NavLink>
          <NavLink
            to="/instructor/assignments"
            className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
            style={{ justifyContent: 'flex-start', border: 'none', padding: '10px 14px' }}
          >
            <FileCheck size={18} /> Submissions
          </NavLink>
          <NavLink
            to="/instructor/analytics"
            className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
            style={{ justifyContent: 'flex-start', border: 'none', padding: '10px 14px' }}
          >
            <BarChart3 size={18} /> Analytics
          </NavLink>
        </>
      )}

      {/* Admin Nav */}
      {isAdmin && (
        <>
          <NavLink
            to="/lms/admin"
            end
            className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
            style={{ justifyContent: 'flex-start', border: 'none', padding: '10px 14px' }}
          >
            <LayoutDashboard size={18} /> Admin Overview
          </NavLink>
          <NavLink
            to="/lms/admin/users"
            className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
            style={{ justifyContent: 'flex-start', border: 'none', padding: '10px 14px' }}
          >
            <UserCheck size={18} /> User Directory
          </NavLink>
          <NavLink
            to="/lms/admin/courses"
            className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
            style={{ justifyContent: 'flex-start', border: 'none', padding: '10px 14px' }}
          >
            <BookOpen size={18} /> Course Moderation
          </NavLink>
          <NavLink
            to="/lms/admin/categories"
            className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
            style={{ justifyContent: 'flex-start', border: 'none', padding: '10px 14px' }}
          >
            <FolderTree size={18} /> Categories
          </NavLink>
          <NavLink
            to="/lms/admin/audit-logs"
            className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
            style={{ justifyContent: 'flex-start', border: 'none', padding: '10px 14px' }}
          >
            <History size={18} /> Audit Logs
          </NavLink>
        </>
      )}
    </aside>
  );
};
