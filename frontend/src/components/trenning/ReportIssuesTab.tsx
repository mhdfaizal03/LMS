import React, { useState } from 'react';
import {
  MessageSquare, Send, ChevronDown, UserPlus, Play, Edit3,
  MoreHorizontal, AlertCircle, FileText, CheckCircle2, TrendingUp
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export const ReportIssuesTab: React.FC = () => {
  const { showToast } = useNotification();
  const [activeSideTab, setActiveSideTab] = useState<'statistics' | 'assignees'>('statistics');
  const [issueTypeFilter, setIssueTypeFilter] = useState<string>('All type issue');

  const issueCategories = [
    { label: 'Content Clarity Issues', count: 65, color: '#0ea5e9', pct: 80 },
    { label: 'Visual Quality Issues', count: 15, color: '#0ea5e9', pct: 25 },
    { label: 'Typographical and Language Errors', count: 10, color: '#0ea5e9', pct: 18 },
    { label: 'Technical Issues', count: 20, color: '#0ea5e9', pct: 32 },
    { label: 'Or others', count: 10, color: '#0ea5e9', pct: 18 },
  ];

  const issueReports = [
    {
      id: 1,
      name: 'Adit Irawan',
      avatar: 'AI',
      avatarBg: '#0ea5e9',
      time: '2 hours ago',
      issue: 'Lack of clarity in explaining in motion methodologies requires additional examples or visual aids for better understanding.',
      category: 'Content Clarity Issues',
      chapter: 'Chapter 1',
    },
    {
      id: 2,
      name: 'Friza Prakesa',
      avatar: 'FP',
      avatarBg: '#f97316',
      time: '2 hours ago',
      issue: "In the 'Final Trough on UI Heuristic' module, there's an unclear image. Please fix it so that I can understand the intended meaning of the content.",
      category: 'Content Clarity Issues',
      chapter: 'Chapter 1',
    },
    {
      id: 3,
      name: 'Taufik Hidayat',
      avatar: 'TH',
      avatarBg: '#ef4444',
      time: '2 hours ago',
      issue: 'Outdated information in Prototyping apps section needs updating for relevance to current prototyping practices.',
      category: 'Content Clarity Issues',
      chapter: 'Chapter 1',
    },
    {
      id: 4,
      name: 'Hendar Misdar',
      avatar: 'HM',
      avatarBg: '#10b981',
      time: '2 hours ago',
      issue: 'Inconsistent formatting throughout the content hinders smooth information flow; a review for consistency is recommended.',
      category: 'Content Clarity Issues',
      chapter: 'Chapter 1',
    },
  ];

  const assignees = [
    { name: 'Adit Irawan', tag: 'Design', role: 'Jr UI/UX Designer', color: '#ec4899' },
    { name: 'Arif Ariyanto', tag: 'Design', role: 'Jr UI/UX Designer', color: '#10b981' },
    { name: 'Ardhi Mubarok', tag: 'Design', role: 'Jr UI/UX Designer', color: '#06b6d4' },
    { name: 'Eka Sanubari', tag: 'Design', role: 'Jr UI/UX Designer', color: '#f59e0b' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '2rem', alignItems: 'start' }}>
      {/* Middle: Reports Feed & Category Breakdown */}
      <div>
        {/* Header & Filter */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 800 }}>
            Report Issue <span className="badge badge-secondary" style={{ marginLeft: '4px' }}>120</span>
          </h2>
          <button
            onClick={() => showToast('Issue filter options', 'info')}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8125rem', borderRadius: 'var(--radius-md)' }}
          >
            {issueTypeFilter} <ChevronDown size={14} />
          </button>
        </div>

        {/* 120 Report Summary Card */}
        <div
          className="card"
          style={{
            padding: '1.5rem',
            borderRadius: '20px',
            marginBottom: '1.5rem',
            backgroundColor: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '1.125rem', fontWeight: 800 }}>120 Report</span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Lastest Report 2 hours ago</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1.25rem' }}>
            Based on 12 Learners
          </div>

          {/* Horizontal Bar Category Distribution */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {issueCategories.map((cat, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '180px minmax(0, 1fr) 70px', alignItems: 'center', gap: '12px', fontSize: '0.75rem' }}>
                <span style={{ color: '#475569', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {cat.label}
                </span>
                <div style={{ height: '14px', borderRadius: '4px', backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${cat.pct}%`,
                      backgroundColor: cat.color,
                      borderRadius: '4px',
                    }}
                  />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>
                  {cat.count} Issue
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Individual Issue Report Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {issueReports.map((report) => (
            <div
              key={report.id}
              className="card card-hover"
              style={{
                padding: '1.25rem',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              {/* Header with avatar & time */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: report.avatarBg,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                  }}
                >
                  {report.avatar}
                </div>
                <div>
                  <span style={{ fontWeight: 800, fontSize: '0.875rem' }}>{report.name}</span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginLeft: '8px' }}>{report.time}</span>
                </div>
              </div>

              {/* Issue Description */}
              <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.5 }}>
                {report.issue}
              </p>

              {/* Bottom tag & Send message button */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid #f8fafc', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#64748b' }}>
                  <span style={{ color: '#6366f1', fontWeight: 700 }}>|</span>
                  <span>{report.category}</span>
                  <span>&bull;</span>
                  <span>Report in 📑 {report.chapter}</span>
                </div>

                <button
                  onClick={() => showToast(`Direct message thread opened with ${report.name}`, 'info')}
                  className="btn btn-secondary btn-sm"
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-full)',
                    padding: '3px 10px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Send size={12} /> Send a Message
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Sidebar: Statistics Line Chart / Assignees */}
      <div
        className="card"
        style={{
          padding: '1.5rem',
          borderRadius: '20px',
          backgroundColor: '#ffffff',
          position: 'sticky',
          top: '20px',
        }}
      >
        {/* Tab Headers */}
        <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', marginBottom: '1.25rem' }}>
          <button
            onClick={() => setActiveSideTab('statistics')}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              background: 'transparent',
              fontSize: '0.8125rem',
              fontWeight: activeSideTab === 'statistics' ? 700 : 500,
              color: activeSideTab === 'statistics' ? '#0f172a' : '#94a3b8',
              borderBottom: activeSideTab === 'statistics' ? '2px solid #0f172a' : 'none',
              cursor: 'pointer',
            }}
          >
            📊 Statistics
          </button>
          <button
            onClick={() => setActiveSideTab('assignees')}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              background: 'transparent',
              fontSize: '0.8125rem',
              fontWeight: activeSideTab === 'assignees' ? 700 : 500,
              color: activeSideTab === 'assignees' ? '#0f172a' : '#94a3b8',
              borderBottom: activeSideTab === 'assignees' ? '2px solid #0f172a' : 'none',
              cursor: 'pointer',
            }}
          >
            👤 Assignees
          </button>
        </div>

        {activeSideTab === 'statistics' ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Show data in <strong>Last 7 days ⌄</strong></span>
            </div>

            {/* Spline Line Chart Mockup */}
            <div
              style={{
                height: '130px',
                borderRadius: '12px',
                backgroundColor: '#fafbfc',
                border: '1px solid #f1f5f9',
                padding: '8px',
                position: 'relative',
                marginBottom: '1rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
              }}
            >
              {/* SVG Area spline */}
              <svg width="100%" height="80" viewBox="0 0 240 80" style={{ overflow: 'visible' }}>
                {/* Completed Line (Cyan) */}
                <path
                  d="M 10 60 Q 40 45, 80 15 T 140 45 T 180 50 T 230 40"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2.5"
                />
                {/* In Progress Line (Yellow) */}
                <path
                  d="M 10 40 Q 40 65, 80 50 T 140 68 T 180 65 T 230 50"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                />
              </svg>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.625rem', color: '#94a3b8', marginTop: '4px' }}>
                <span>Oct 1</span>
                <span>Oct 4</span>
                <span>Oct 7</span>
              </div>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#f59e0b', borderRadius: '2px', marginRight: '4px' }} />
                <span>Inprogress</span>
                <div style={{ fontWeight: 800, color: '#0f172a' }}>12 <span style={{ color: '#94a3b8', fontWeight: 500 }}>• 45%</span></div>
              </div>
              <div>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#06b6d4', borderRadius: '2px', marginRight: '4px' }} />
                <span>Completed</span>
                <div style={{ fontWeight: 800, color: '#0f172a' }}>16 <span style={{ color: '#94a3b8', fontWeight: 500 }}>• 55%</span></div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
              32 assignees
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
              {assignees.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: a.color, color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6875rem', fontWeight: 800 }}>
                      {a.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 700 }}>
                        {a.name} <span style={{ fontSize: '0.6875rem', color: '#94a3b8', fontWeight: 400 }}>{a.tag}</span>
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>{a.role}</div>
                    </div>
                  </div>
                  <button className="btn-icon" style={{ width: '24px', height: '24px', padding: 0 }}>
                    <MoreHorizontal size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => showToast('Assign modal opened', 'info')}
            className="btn btn-primary"
            style={{ backgroundColor: '#4338ca', width: '100%', borderRadius: 'var(--radius-full)', fontWeight: 700 }}
          >
            + Assign
          </button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => showToast('Preview mode enabled', 'info')}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, borderRadius: 'var(--radius-full)' }}
            >
              <Play size={12} /> Preview
            </button>
            <button
              onClick={() => showToast('Edit content mode enabled', 'info')}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, borderRadius: 'var(--radius-full)' }}
            >
              <Edit3 size={12} /> Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
