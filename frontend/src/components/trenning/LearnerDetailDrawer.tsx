import React, { useState } from 'react';
import {
  X, ChevronLeft, ChevronRight, Filter, Search,
  Clock, CheckCircle, MessageSquare, UploadCloud,
  FileText, BookOpen, Layers, Award, Smile, ChevronDown, CheckCircle2
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

interface LearnerDetailDrawerProps {
  learnerName?: string;
  onClose: () => void;
}

export const LearnerDetailDrawer: React.FC<LearnerDetailDrawerProps> = ({
  learnerName = 'Adit Irawan',
  onClose,
}) => {
  const { showToast } = useNotification();
  const [activeTab, setActiveTab] = useState<'activity' | 'assigned' | 'review'>('activity');
  const [logFilter, setLogFilter] = useState<string>('Last 7 Day');
  const [reactions, setReactions] = useState<{ [key: string]: number }>({
    chat: 12,
    smile: 1,
    party: 2,
  });

  const handleReact = (type: 'chat' | 'smile' | 'party') => {
    setReactions((prev) => ({ ...prev, [type]: prev[type] + 1 }));
    showToast(`Added reaction`, 'success');
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '560px',
        maxWidth: '90vw',
        height: '100vh',
        backgroundColor: '#ffffff',
        boxShadow: '-8px 0 30px rgba(0, 0, 0, 0.12)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        overflowY: 'auto',
      }}
    >
      {/* 1. TOP HEADER & PROFILE (IMAGE 4) */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Avatar with online dot */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#0ea5e9',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.125rem',
                }}
              >
                AI
              </div>
              <span
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  border: '2px solid #ffffff',
                }}
              />
            </div>

            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>{learnerName}</h2>
              <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                <div>Division: <strong style={{ color: '#0f172a' }}>Design</strong></div>
                <div>Job: <strong style={{ color: '#0f172a' }}>Jr UI/UX Designer</strong></div>
                <div>Email: <strong style={{ color: '#0f172a' }}>aditirwan@mail.com</strong></div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button className="btn-icon" style={{ width: '28px', height: '28px' }} title="Previous learner"><ChevronLeft size={14} /></button>
            <button className="btn-icon" style={{ width: '28px', height: '28px' }} title="Next learner"><ChevronRight size={14} /></button>
            <button onClick={onClose} className="btn-icon" style={{ width: '28px', height: '28px' }} title="Close drawer"><X size={16} /></button>
          </div>
        </div>

        {/* Subtabs: Activity | Assigned (2) | Need to review */}
        <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
          <button
            onClick={() => setActiveTab('activity')}
            className={`trenning-tab ${activeTab === 'activity' ? 'active' : ''}`}
            style={{ padding: '8px 4px', fontSize: '0.875rem' }}
          >
            Activity
          </button>
          <button
            onClick={() => setActiveTab('assigned')}
            className={`trenning-tab ${activeTab === 'assigned' ? 'active' : ''}`}
            style={{ padding: '8px 4px', fontSize: '0.875rem' }}
          >
            Assigned (2)
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={`trenning-tab ${activeTab === 'review' ? 'active' : ''}`}
            style={{ padding: '8px 4px', fontSize: '0.875rem' }}
          >
            Need to review
          </button>
        </div>
      </div>

      {/* 2. DRAWER BODY */}
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {/* Trending Contents Box */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#0f172a' }}>Trending contents ⓘ</span>
            <button className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>
              Last 24 hours <ChevronDown size={12} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Task 1 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#fafbfc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem' }}>
                <span>📑</span>
                <span style={{ fontWeight: 700 }}>Mobile & Desktop Screen Pattern</span>
                <span className="badge badge-secondary" style={{ fontSize: '0.6875rem' }}>Assignment</span>
              </div>
              <div style={{ width: '120px', height: '18px', backgroundColor: '#dcfce7', borderRadius: '4px', overflow: 'hidden', display: 'flex', alignItems: 'center', padding: '0 8px', fontSize: '0.6875rem', color: '#166534', fontWeight: 700 }}>
                60% (5 hrs)
              </div>
            </div>

            {/* Task 2 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#fafbfc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem' }}>
                <span>📝</span>
                <span style={{ fontWeight: 700 }}>Creating Engaging Learning Journeys: U...</span>
                <span className="badge badge-secondary" style={{ fontSize: '0.6875rem' }}>Quiz</span>
              </div>
              <div style={{ width: '120px', height: '18px', backgroundColor: '#fef3c7', borderRadius: '4px', overflow: 'hidden', display: 'flex', alignItems: 'center', padding: '0 8px', fontSize: '0.6875rem', color: '#92400e', fontWeight: 700 }}>
                30% (2 hrs)
              </div>
            </div>

            {/* Other task */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#fafbfc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>Other task</span>
              <div style={{ width: '120px', height: '18px', backgroundColor: '#f1f5f9', borderRadius: '4px', display: 'flex', alignItems: 'center', padding: '0 8px', fontSize: '0.6875rem', color: '#475569', fontWeight: 700 }}>
                10% (30 min)
              </div>
            </div>
          </div>
        </div>

        {/* Log & Activity Timeline */}
        <div>
          {/* Filter Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 800 }}>Log ⓘ</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem', padding: '3px 8px' }}>
                <Filter size={12} /> Add Filter
              </button>
              <div style={{ position: 'relative' }}>
                <Search size={12} color="#94a3b8" style={{ position: 'absolute', top: '7px', left: '8px' }} />
                <input
                  type="text"
                  placeholder="Search..."
                  style={{ width: '100px', padding: '4px 6px 4px 24px', fontSize: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                />
              </div>
              <button className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem', padding: '3px 8px' }}>
                {logFilter} <ChevronDown size={12} />
              </button>
            </div>
          </div>

          {/* Timeline Stream (Image 4) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative', paddingLeft: '24px' }}>
            <div style={{ position: 'absolute', top: '8px', bottom: '8px', left: '8px', width: '2px', backgroundColor: '#e2e8f0' }} />

            {/* Event 1: Started Course */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-20px', top: '2px', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#6366f1', border: '3px solid #ffffff' }} />
              <div style={{ fontSize: '0.8125rem', fontWeight: 700 }}>
                Started a Course 📘 <span style={{ color: '#4338ca' }}>"A Designer's Toolkit for Crafting Exceptional Learning Management..."</span>
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#94a3b8', marginTop: '2px' }}>12 March 2023 • 10:30am</div>
            </div>

            {/* Event 2: Completed Quiz */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-20px', top: '2px', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#10b981', border: '3px solid #ffffff' }} />
              <div style={{ fontSize: '0.8125rem', fontWeight: 700 }}>
                Completed the Quiz 📝 "Creating Engaging Learning Journeys: UI/UX Best Practices in..." with a <span style={{ color: '#b45309' }}>🟡 95 points</span>
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#94a3b8', marginTop: '2px' }}>10 March 2023 • 10:30am</div>
            </div>

            {/* Event 3: Give Feedback */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-20px', top: '2px', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#f59e0b', border: '3px solid #ffffff' }} />
              <div style={{ fontSize: '0.8125rem', fontWeight: 700 }}>
                Give Feedback in a Page 📄 <span style={{ color: '#4338ca' }}>"A Designer's Toolkit for Crafting Exceptional Learning M..."</span>
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#94a3b8', marginTop: '2px', marginBottom: '8px' }}>09 March 2023 • 11:30am</div>

              {/* Feedback comment box */}
              <div style={{ backgroundColor: '#fafbfc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px' }}>
                <p style={{ fontSize: '0.8125rem', color: '#334155', lineHeight: 1.4, marginBottom: '8px' }}>
                  "In the course's text citation, the language is still unclear for readers who are just starting to learn, or juniors."
                </p>
                {/* Reaction buttons */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => handleReact('chat')}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.6875rem', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}
                  >
                    💬 {reactions.chat}
                  </button>
                  <button
                    onClick={() => handleReact('smile')}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.6875rem', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}
                  >
                    😅 {reactions.smile}
                  </button>
                  <button
                    onClick={() => handleReact('party')}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.6875rem', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}
                  >
                    🥳 {reactions.party}
                  </button>
                </div>
              </div>
            </div>

            {/* Event 4: Uploaded Attachment */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-20px', top: '2px', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#06b6d4', border: '3px solid #ffffff' }} />
              <div style={{ fontSize: '0.8125rem', fontWeight: 700 }}>
                Uploaded Attachment in Assignment 📁 <span style={{ color: '#4338ca' }}>Style Direction</span>
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#94a3b8', marginTop: '2px' }}>08 March 2023 • 11:30am</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
