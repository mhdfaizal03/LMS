import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { notificationApi } from '../../api';
import { NotificationItem } from '../../types';
import { TrenningNotificationDrawer } from '../trenning/TrenningNotificationDrawer';
import { AskAIModal } from '../trenning/AskAIModal';
import {
  BookOpen, Bell, Sun, Moon, User as UserIcon, LogOut,
  LayoutDashboard, Award, CheckCheck, Menu, X, Shield, GraduationCap, Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [showNotifMenu, setShowNotifMenu] = useState<boolean>(false);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  const [showAIModal, setShowAIModal] = useState<boolean>(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      notificationApi.getNotifications().then((data) => {
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.is_read).length);
      }).catch(console.error);
    }
  }, [user]);

  // Click outside to close menus
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin' || user.role === 'superadmin') return '/lms/admin';
    if (user.role === 'instructor') return '/instructor';
    return '/student';
  };

  const getProfilePath = () => {
    if (!user) return '/login';
    if (user.role === 'admin' || user.role === 'superadmin') return '/lms/admin/profile';
    if (user.role === 'instructor') return '/instructor/profile';
    return '/student/profile';
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'var(--bg-glass)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-color)',
        height: '68px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          width: '100%',
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--primary), #818cf8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px var(--primary-glow)',
            }}
          >
            <GraduationCap size={24} />
          </div>
          <span style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
            Edu<span style={{ color: 'var(--primary)' }}>Pulse</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '1.5rem' }} className="desktop-nav">
          <Link to="/courses" style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Explore Courses
          </Link>
          <Link to="/verify-certificate" style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Verify Certificate
          </Link>
          {user && (
            <Link to={getDashboardPath()} style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Dashboard
            </Link>
          )}
          <button
            onClick={() => setShowAIModal(true)}
            className="btn btn-secondary btn-sm"
            style={{
              backgroundColor: '#eef2ff',
              color: '#4338ca',
              border: '1px solid #c7d2fe',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
              fontSize: '0.8125rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            ✨ Ask AI
          </button>
        </nav>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn-icon"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {user ? (
            <>
              {/* Notification Bell */}
              <div style={{ position: 'relative' }} ref={notifRef}>
                <button
                  onClick={() => setShowNotifMenu(!showNotifMenu)}
                  className="btn-icon"
                  style={{ position: 'relative' }}
                  aria-label="Notifications"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--danger)',
                      }}
                    />
                  )}
                </button>

                {showNotifMenu && (
                  <TrenningNotificationDrawer onClose={() => setShowNotifMenu(false)} />
                )}
              </div>

              {/* User Avatar & Dropdown */}
              <div style={{ position: 'relative' }} ref={userRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </button>

                {showUserMenu && (
                  <div
                    className="card"
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '48px',
                      width: '220px',
                      padding: '0.75rem',
                      zIndex: 100,
                      boxShadow: 'var(--shadow-xl)',
                    }}
                  >
                    <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{user.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
                      <span className="badge badge-primary" style={{ marginTop: '6px', fontSize: '0.6875rem' }}>
                        {user.role}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <Link
                        to={getDashboardPath()}
                        onClick={() => setShowUserMenu(false)}
                        className="btn-secondary"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          border: 'none',
                          justifyContent: 'flex-start',
                        }}
                      >
                        <LayoutDashboard size={16} /> Dashboard
                      </Link>
                      <Link
                        to={getProfilePath()}
                        onClick={() => setShowUserMenu(false)}
                        className="btn-secondary"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          border: 'none',
                          justifyContent: 'flex-start',
                        }}
                      >
                        <UserIcon size={16} /> Profile Settings
                      </Link>
                      <button
                        onClick={logout}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          border: 'none',
                          background: 'transparent',
                          color: 'var(--danger)',
                          cursor: 'pointer',
                          width: '100%',
                          textAlign: 'left',
                        }}
                      >
                        <LogOut size={16} /> Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {showAIModal && <AskAIModal onClose={() => setShowAIModal(false)} />}
    </header>
  );
};
