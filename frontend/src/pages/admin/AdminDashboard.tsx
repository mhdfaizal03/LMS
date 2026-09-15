import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { analyticsApi } from '../../api';
import { AdminDashboardStats } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useNotification } from '../../context/NotificationContext';
import {
  Users, BookOpen, Award, ShieldCheck, UserCheck, FolderTree,
  History, ArrowRight, Bell, Eye, Plus, Sparkles, TrendingUp,
  TrendingDown, DollarSign, X, CheckCircle, ChevronDown
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { showToast } = useNotification();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [revenueTimeframe, setRevenueTimeframe] = useState<'weekly' | 'monthly' | 'yearly'>('yearly');
  const [showTrialBanner, setShowTrialBanner] = useState<boolean>(true);

  useEffect(() => {
    analyticsApi.getAdminStats()
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const topStudents = [
    { rank: 1, name: 'Julian', avatar: '👨‍🎓', xp: 6937, medal: '🥇' },
    { rank: 2, name: 'Vulkan', avatar: '👨‍💻', xp: 5169, medal: '🥈' },
    { rank: 3, name: 'Jhonathan', avatar: '👨‍🎨', xp: 4283, medal: '🥉' },
    { rank: 4, name: 'Annatasya', avatar: '👩‍💼', xp: 3909, medal: null },
    { rank: 5, name: 'Queen', avatar: '👩‍🎨', xp: 3166, medal: null },
  ];

  if (loading) return <LoadingSpinner message="Loading school admin dashboard..." />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* 1. TOP TRIAL BANNER (IMAGE 3) */}
      {showTrialBanner && (
        <div
          style={{
            backgroundColor: '#f5f3ff',
            border: '1px solid #ddd6fe',
            borderRadius: '14px',
            padding: '10px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8125rem',
            color: '#5b21b6',
          }}
        >
          <div>
            You have <strong>30 days</strong> left on your free trial of the Personal plan.{' '}
            <button
              onClick={() => showToast('Redirecting to upgrade checkout...', 'info')}
              style={{ background: 'transparent', border: 'none', color: '#6d28d9', fontWeight: 800, textDecoration: 'underline', cursor: 'pointer' }}
            >
              Upgrade Now
            </button>
          </div>
          <button onClick={() => setShowTrialBanner(false)} className="btn-icon" style={{ width: '24px', height: '24px' }}>
            <X size={14} color="#6d28d9" />
          </button>
        </div>
      )}

      {/* 2. HEADER GREETING & ACTIONS */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'inherit' }}>
            Welcome back, Elux Space 👋
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '2px' }}>
            Everything in Mentori can do for your online course business
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => showToast('No unread admin alerts', 'info')}
            className="btn-icon"
            style={{ width: '36px', height: '36px', borderRadius: '10px' }}
            title="Notifications"
          >
            <Bell size={18} />
          </button>
          <button
            onClick={() => navigate('/courses')}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '10px', fontSize: '0.8125rem', fontWeight: 700 }}
          >
            <Eye size={16} /> View Your School
          </button>
        </div>
      </div>

      {/* 3. PRODUCT QUICK CREATE PILLS */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={() => navigate('/instructor/courses/new')}
          className="btn"
          style={{ backgroundColor: '#e0e7ff', color: '#4338ca', borderRadius: '12px', fontWeight: 700, fontSize: '0.8125rem', padding: '8px 14px' }}
        >
          <BookOpen size={15} /> Online Courses +
        </button>
        <button
          onClick={() => showToast('Coaching setup modal', 'info')}
          className="btn"
          style={{ backgroundColor: '#ffedd5', color: '#c2410c', borderRadius: '12px', fontWeight: 700, fontSize: '0.8125rem', padding: '8px 14px' }}
        >
          <span>📅</span> Coaching +
        </button>
        <button
          onClick={() => showToast('Digital Downloads setup modal', 'info')}
          className="btn"
          style={{ backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '12px', fontWeight: 700, fontSize: '0.8125rem', padding: '8px 14px' }}
        >
          <span>📥</span> Digital Downloads +
        </button>
        <button
          onClick={() => showToast('Webinar setup modal', 'info')}
          className="btn"
          style={{ backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '12px', fontWeight: 700, fontSize: '0.8125rem', padding: '8px 14px' }}
        >
          <span>▶</span> Webinar +
        </button>
        <button
          onClick={() => showToast('Bundle creation modal', 'info')}
          className="btn"
          style={{ backgroundColor: '#ccfbf1', color: '#0f766e', borderRadius: '12px', fontWeight: 700, fontSize: '0.8125rem', padding: '8px 14px' }}
        >
          <span>📦</span> Bundles +
        </button>
      </div>

      {/* 4. REVENUE & SUBSCRIBERS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px minmax(0, 1fr) 220px', gap: '1.5rem', alignItems: 'stretch' }}>
        {/* Left column: 3 KPI Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Subscribers */}
          <div className="card" style={{ padding: '1.25rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#e0e7ff', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.125rem' }}>
              👤
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 900 }}>10,000</span>
                <span style={{ fontSize: '0.6875rem', color: '#10b981', fontWeight: 700 }}>↗ 1.5%</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Subscribers</div>
            </div>
          </div>

          {/* Customers */}
          <div className="card" style={{ padding: '1.25rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#e0e7ff', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.125rem' }}>
              👥
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 900 }}>9.500</span>
                <span style={{ fontSize: '0.6875rem', color: '#ef4444', fontWeight: 700 }}>↘ 0.8%</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Customers</div>
            </div>
          </div>

          {/* Members */}
          <div className="card" style={{ padding: '1.25rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#e0e7ff', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.125rem' }}>
              🎯
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 900 }}>5,000</span>
                <span style={{ fontSize: '0.6875rem', color: '#10b981', fontWeight: 700 }}>↗ 2.0%</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Members</div>
            </div>
          </div>
        </div>

        {/* Center: Revenue & Sales Chart Card */}
        <div className="card" style={{ padding: '1.5rem', borderRadius: '20px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.9375rem', fontWeight: 800 }}>Revenue & Sales ⓘ</div>
            <div style={{ display: 'flex', backgroundColor: '#f1f5f9', borderRadius: '8px', padding: '2px' }}>
              <button
                onClick={() => setRevenueTimeframe('weekly')}
                style={{ padding: '4px 8px', border: 'none', background: revenueTimeframe === 'weekly' ? '#ffffff' : 'transparent', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Weekly
              </button>
              <button
                onClick={() => setRevenueTimeframe('monthly')}
                style={{ padding: '4px 8px', border: 'none', background: revenueTimeframe === 'monthly' ? '#ffffff' : 'transparent', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Monthly
              </button>
              <button
                onClick={() => setRevenueTimeframe('yearly')}
                style={{ padding: '4px 8px', border: 'none', background: revenueTimeframe === 'yearly' ? '#ffffff' : 'transparent', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Yearly
              </button>
            </div>
          </div>

          {/* Spline Area Chart (Image 3) */}
          <div style={{ flex: 1, minHeight: '160px', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <svg width="100%" height="130" viewBox="0 0 500 130" style={{ overflow: 'visible' }}>
              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" strokeDasharray="3 3" />
              <line x1="0" y1="70" x2="500" y2="70" stroke="#f1f5f9" strokeDasharray="3 3" />
              <line x1="0" y1="110" x2="500" y2="110" stroke="#f1f5f9" strokeDasharray="3 3" />

              {/* Vertical July Marker */}
              <line x1="280" y1="10" x2="280" y2="120" stroke="#cbd5e1" strokeDasharray="2 2" />

              {/* Revenue Curve (Purple) */}
              <path
                d="M 10 90 Q 60 90, 100 80 T 180 85 T 240 60 T 280 40 T 330 15 T 380 60 T 430 85 T 490 80"
                fill="none"
                stroke="#6366f1"
                strokeWidth="2.5"
              />

              {/* Sales Curve (Amber) */}
              <path
                d="M 10 110 Q 60 110, 100 100 T 180 105 T 240 95 T 280 80 T 330 85 T 380 95 T 430 80 T 490 90"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
              />
            </svg>

            {/* Hover Tooltip at July (Image 3) */}
            <div
              style={{
                position: 'absolute',
                top: '20px',
                left: '210px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '6px 10px',
                boxShadow: '0 8px 18px rgba(0,0,0,0.08)',
                fontSize: '0.6875rem',
                zIndex: 10,
              }}
            >
              <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>July 2024</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <span style={{ color: '#6366f1' }}>■ Revenue</span>
                <strong>$1,000</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <span style={{ color: '#f59e0b' }}>■ Sales</span>
                <strong>25</strong>
              </div>
            </div>

            {/* Month labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: '#94a3b8', marginTop: '6px' }}>
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><strong style={{ color: '#0f172a' }}>Jul</strong><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
            </div>
          </div>
        </div>

        {/* Right column: Total Revenue & Total Sales stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card" style={{ padding: '1.25rem', borderRadius: '16px' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', backgroundColor: '#6366f1', borderRadius: '2px' }} />
              Total Revenue
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: '4px 0' }}>
              $31,071
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#10b981', fontWeight: 700 }}>
              ↗ 13% <span style={{ color: '#94a3b8', fontWeight: 400 }}>+$3k today</span>
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderRadius: '16px' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', backgroundColor: '#f59e0b', borderRadius: '2px' }} />
              Total Sales
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: '4px 0' }}>
              2,500
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#10b981', fontWeight: 700 }}>
              ↗ 5.7% <span style={{ color: '#94a3b8', fontWeight: 400 }}>+300 today</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. BOTTOM SECTION: TOP STUDENTS + STUDENTS PROGRESS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.5rem' }}>
        {/* Left: Top Students XP Leaderboard (Image 3) */}
        <div className="card" style={{ padding: '1.5rem', borderRadius: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.9375rem', fontWeight: 800 }}>Top Students ⓘ</span>
            <button
              onClick={() => showToast('Opening complete leaderboard', 'info')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', borderRadius: '8px' }}
            >
              View All
            </button>
          </div>

          <table className="data-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ width: '50px' }}>Rank</th>
                <th>Name</th>
                <th>XP Point</th>
                <th style={{ width: '40px' }}></th>
              </tr>
            </thead>
            <tbody>
              {topStudents.map((st) => (
                <tr key={st.rank}>
                  <td>
                    {st.medal ? (
                      <span style={{ fontSize: '1.125rem' }}>{st.medal}</span>
                    ) : (
                      <span style={{ fontWeight: 700, color: '#94a3b8' }}>{st.rank}</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>
                        {st.avatar}
                      </span>
                      <strong style={{ fontSize: '0.8125rem' }}>{st.name}</strong>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, fontSize: '0.8125rem', color: '#475569' }}>
                      {st.xp.toLocaleString()} XP
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => showToast(`Viewing profile of ${st.name}`, 'info')}
                      className="btn-icon"
                      style={{ width: '24px', height: '24px', padding: 0 }}
                    >
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right: Students Progress Striped Barcode Card (Image 3) */}
        <div className="card" style={{ padding: '1.5rem', borderRadius: '20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '0.9375rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Students Progress ⓘ
          </div>

          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', marginBottom: '10px' }}>
            200
          </div>

          {/* Striped Barcode Progress Bar */}
          <div style={{ display: 'flex', gap: '3px', height: '28px', marginBottom: '1.25rem', overflow: 'hidden' }}>
            {/* 10 purple stripes (Passed 50%) */}
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={`p-${i}`} style={{ flex: 1, backgroundColor: '#818cf8', borderRadius: '3px' }} />
            ))}
            {/* 3 amber stripes (Failed 10%) */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={`f-${i}`} style={{ flex: 1, backgroundColor: '#f59e0b', borderRadius: '3px' }} />
            ))}
            {/* 2 red stripes (Overdue 5%) */}
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={`o-${i}`} style={{ flex: 1, backgroundColor: '#ef4444', borderRadius: '3px' }} />
            ))}
            {/* 6 cyan stripes (In Progress 25%) */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={`ip-${i}`} style={{ flex: 1, backgroundColor: '#06b6d4', borderRadius: '3px' }} />
            ))}
            {/* 3 gray stripes (Not Started 10%) */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={`ns-${i}`} style={{ flex: 1, backgroundColor: '#e2e8f0', borderRadius: '3px' }} />
            ))}
          </div>

          {/* Status Breakdown Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#818cf8' }} /> Passed</span>
              <strong>50%</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#f59e0b' }} /> Failed</span>
              <strong>10%</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#ef4444' }} /> Overdue</span>
              <strong>5%</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#06b6d4' }} /> In Progress</span>
              <strong>25%</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#e2e8f0' }} /> Not Started</span>
              <strong>10%</strong>
            </div>
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
            <button
              onClick={() => showToast('Opening detailed learner cohort analytics', 'info')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', borderRadius: '8px' }}
            >
              View Details
            </button>
            <span style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>
              This analysis was calculated since <strong>last month</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
