import React, { useState } from 'react';
import {
  MessageSquare, ArrowUpDown, UserPlus, Play, Edit3,
  CheckCircle2, Users, MoreHorizontal, Send
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export const DiscussionTab: React.FC = () => {
  const { showToast } = useNotification();
  const [activeSideTab, setActiveSideTab] = useState<'statistics' | 'assignees'>('assignees');
  const [newReplyText, setNewReplyText] = useState<string>('');

  const discussions = [
    {
      id: 1,
      chapter: 'Chapter 1 • Step by step usability principal',
      title: 'Several sentences are confusing',
      avatars: ['TP', 'JK', 'KT', 'Wi'],
      repliesCount: 12,
      viewsCount: 20,
      time: 'Last reply 32m ago',
    },
    {
      id: 2,
      chapter: 'Chapter 2 • Visibility of system status',
      title: 'In banner Remember, not clear.',
      avatars: ['LR', 'AI'],
      repliesCount: 9,
      viewsCount: 2,
      time: 'Last reply 32m ago',
    },
    {
      id: 3,
      chapter: 'Chapter 3 • User control and freedom',
      title: 'After the mentioned page, let\'s add content on "Interaction Design"',
      avatars: ['AI'],
      repliesCount: 2,
      viewsCount: 4,
      time: 'Last reply 32m ago',
    },
    {
      id: 4,
      chapter: 'Chapter 4 • Consistency and standards',
      title: 'It\'s given a video explanation on the image.',
      avatars: ['TH', 'IB'],
      repliesCount: 5,
      viewsCount: 8,
      time: 'Last reply 32m ago',
    },
    {
      id: 5,
      chapter: 'Chapter 3 • User control and freedom',
      title: 'The words used in the description are hard to understand and might confuse people learning. Please make it easier to understand.',
      avatars: ['FP'],
      repliesCount: 3,
      viewsCount: 23,
      time: 'Last reply 32m ago',
    },
    {
      id: 6,
      chapter: 'Chapter 1 • Step by step usability principal',
      title: 'The video is not smooth during playback.',
      avatars: ['AI', 'BF'],
      repliesCount: 9,
      viewsCount: 45,
      time: 'Last reply 32m ago',
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
      {/* Middle Discussion Feed */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 800 }}>
            Discussion <span className="badge badge-secondary" style={{ marginLeft: '4px' }}>12</span>
          </h2>
          <button className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8125rem' }}>
            <ArrowUpDown size={14} /> Recent
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {discussions.map((d) => (
            <div
              key={d.id}
              className="card card-hover"
              style={{ padding: '1.25rem', borderRadius: '16px', cursor: 'pointer' }}
              onClick={() => showToast(`Opened thread: "${d.title}"`, 'info')}
            >
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, marginBottom: '4px' }}>
                {d.chapter}
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'inherit', marginBottom: '10px' }}>
                {d.title}
              </h3>

              {/* Thread Meta with Avatar stack */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '-4px' }}>
                  {d.avatars.map((av, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: '#e0e7ff',
                        color: '#4338ca',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.625rem',
                        fontWeight: 800,
                        border: '2px solid #ffffff',
                      }}
                    >
                      {av}
                    </div>
                  ))}
                </div>

                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {d.repliesCount} replies &bull; {d.viewsCount} views &bull; {d.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Assignees Sidebar */}
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

        <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
          32 assignees
        </div>

        {/* Assignee list */}
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

        <button
          onClick={() => showToast('Viewing all 32 assignees', 'info')}
          style={{ background: 'transparent', border: 'none', color: '#4338ca', fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer', marginBottom: '1.5rem', textAlign: 'left', display: 'block' }}
        >
          View All
        </button>

        {/* Actions */}
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
