import React, { useState, useEffect } from 'react';
import { analyticsApi, assignmentApi } from '../../api';
import { AssignmentSubmission } from '../../types';
import { useNotification } from '../../context/NotificationContext';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import {
  FileCheck, CheckCircle, ExternalLink, Award, Clock, User, Send
} from 'lucide-react';

export const GradeAssignmentsPage: React.FC = () => {
  const { showToast } = useNotification();
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Grade Modal State
  const [gradingSub, setGradingSub] = useState<AssignmentSubmission | null>(null);
  const [grade, setGrade] = useState<number>(90);
  const [feedback, setFeedback] = useState<string>('');
  const [isGrading, setIsGrading] = useState<boolean>(false);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const stats = await analyticsApi.getInstructorStats();
      setSubmissions(stats.recent_submissions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleOpenGradeModal = (sub: AssignmentSubmission) => {
    setGradingSub(sub);
    setGrade(sub.grade || 90);
    setFeedback(sub.feedback || '');
  };

  const handleSubmitGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSub) return;

    setIsGrading(true);
    try {
      await assignmentApi.gradeSubmission(gradingSub.id, { grade, feedback });
      showToast('Assignment graded and student notified!', 'success');
      setGradingSub(null);
      loadSubmissions();
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Failed to grade submission', 'error');
    } finally {
      setIsGrading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Student Assignment Submissions</h1>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
          Review practical projects, inspect attached code files, and provide graded evaluations.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading submissions..." />
      ) : submissions.length === 0 ? (
        <EmptyState
          icon={FileCheck}
          title="No submissions needing evaluation"
          description="When enrolled students complete capstone assignments in your courses, their submissions will appear here."
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Submission Content</th>
                <th>Attachment</th>
                <th>Submitted Date</th>
                <th>Status</th>
                <th>Score</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub) => (
                <tr key={sub.id}>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{sub.user?.name || 'Student'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sub.user?.email}</div>
                  </td>
                  <td style={{ maxWidth: '300px' }}>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {sub.submission_text || 'No text note provided.'}
                    </p>
                  </td>
                  <td>
                    {sub.file_url ? (
                      <a
                        href={sub.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '3px 8px' }}
                      >
                        <ExternalLink size={12} /> View File
                      </a>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>None</span>
                    )}
                  </td>
                  <td>{new Date(sub.submitted_at).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${sub.status === 'graded' ? 'badge-success' : 'badge-warning'}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700 }}>
                      {sub.grade !== null && sub.grade !== undefined ? `${sub.grade} pts` : '—'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => handleOpenGradeModal(sub)}
                      className="btn btn-primary btn-sm"
                    >
                      {sub.status === 'graded' ? 'Re-Grade' : 'Grade Submission'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Grade Modal */}
      {gradingSub && (
        <Modal
          isOpen={true}
          onClose={() => setGradingSub(null)}
          title={`Grade Submission — ${gradingSub.user?.name || 'Student'}`}
        >
          <form onSubmit={handleSubmitGrade}>
            <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                STUDENT RESPONSE:
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                {gradingSub.submission_text || 'No text provided.'}
              </p>
              {gradingSub.file_url && (
                <div style={{ marginTop: '8px' }}>
                  <a href={gradingSub.file_url} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.8125rem', textDecoration: 'underline' }}>
                    Inspect attached submission file &rarr;
                  </a>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Grade / Marks Awarded (out of 100)</label>
              <input
                type="number"
                required
                min="0"
                max="100"
                className="form-input"
                value={grade}
                onChange={(e) => setGrade(Number(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Constructive Feedback for Student</label>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder="Share praise and suggestions for architectural or practical improvements..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setGradingSub(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={isGrading} className="btn btn-primary">
                <Send size={16} /> {isGrading ? 'Saving Grade...' : 'Save & Publish Grade'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
