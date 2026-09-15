import React from 'react';
import {
  CheckCheck, Maximize2, Download, MessageSquare, Award,
  Sparkles, BookOpen, Layers, X
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

interface TrenningNotificationDrawerProps {
  onClose: () => void;
}

export const TrenningNotificationDrawer: React.FC<TrenningNotificationDrawerProps> = ({ onClose }) => {
  const { showToast } = useNotification();

  const handleMarkAllRead = () => {
    showToast('All notifications marked as read', 'success');
  };

  const handleDownloadCert = () => {
    showToast('Downloading E-Certificate (PDF)...', 'success');
  };

  return (
    <div className="trenning-notif-drawer">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>Notification</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handleMarkAllRead}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#4338ca',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            Mark as read <CheckCheck size={14} />
          </button>
          <button onClick={onClose} className="btn-icon" style={{ width: '24px', height: '24px' }}>
            <X size={16} />
          </button>
        </div>
      </div>

      {/* TODAY SECTION */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          Today
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Notification 1 */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#e0e7ff', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <BookOpen size={16} />
            </div>
            <div>
              <div style={{ fontSize: '0.8125rem', lineHeight: 1.4 }}>
                <strong>"Mobile & Desktop Screen Pattern"</strong> Course has been assigned for you to learn.
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#94a3b8', marginTop: '2px' }}>32 min ago</div>
            </div>
          </div>

          {/* Notification 2 */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Layers size={16} />
            </div>
            <div>
              <div style={{ fontSize: '0.8125rem', lineHeight: 1.4 }}>
                <strong>"General knowledge & Methodology - Layout..."</strong> Page has been updated.
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#94a3b8', marginTop: '2px' }}>4 hours ago</div>
            </div>
          </div>

          {/* Notification 3 with Points Badge */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Sparkles size={16} />
            </div>
            <div>
              <div style={{ fontSize: '0.8125rem', lineHeight: 1.4 }}>
                <strong>"The Designing User-Centric Learn..."</strong> has been completely reviewed by Trainer.
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#fef9c3', color: '#854d0e', padding: '2px 8px', borderRadius: '12px', fontSize: '0.6875rem', fontWeight: 700, marginTop: '6px' }}>
                🪙 You have earned 100 points
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#94a3b8', marginTop: '4px' }}>11:22 AM</div>
            </div>
          </div>
        </div>
      </div>

      {/* YESTERDAY SECTION */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          Yesterday
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Certificate Download Notification */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Award size={16} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.8125rem', lineHeight: 1.4 }}>
                You have received a certificate for completing the course.
              </div>

              {/* PDF Card */}
              <div
                onClick={handleDownloadCert}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '8px 10px',
                  marginTop: '6px',
                  cursor: 'pointer',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>E-Certificate_Aditya_Irawan.pdf</div>
                  <div style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>3.2mb</div>
                </div>
                <Download size={16} color="#4338ca" />
              </div>

              <div style={{ fontSize: '0.6875rem', color: '#94a3b8', marginTop: '4px' }}>25 November, 2023 &bull; 10:11 AM</div>
            </div>
          </div>

          {/* Trainer Discussion Reply */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#e0e7ff', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <MessageSquare size={16} />
            </div>
            <div>
              <div style={{ fontSize: '0.8125rem', lineHeight: 1.4 }}>
                <strong>Raihan Fikri (Trainer)</strong> has replied to the comment in the discussion.
              </div>
              <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '6px 8px', borderRadius: '6px', fontSize: '0.75rem', color: '#64748b', marginTop: '4px', fontStyle: 'italic' }}>
                "So, the visibility of a system refers to the degree or extent to which its inner workings are observable..."
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#94a3b8', marginTop: '4px' }}>24 November, 2023 &bull; 1:12 AM</div>
            </div>
          </div>
        </div>
      </div>

      {/* LEADERBOARD WIDGET */}
      <div
        style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '0.875rem 1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 800 }}>Leaderboard ⓘ</span>
          <span style={{ fontSize: '0.6875rem', color: '#4338ca', fontWeight: 700 }}>Weekly</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 800, fontSize: '0.875rem', color: '#d97706' }}>#1</span>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#fed7aa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>
              👨‍💻
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.8125rem' }}>Arif Brata</div>
              <div style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>Jr UI/UX Designer</div>
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#b45309' }}>🪙 100pts</span>
        </div>
      </div>
    </div>
  );
};
