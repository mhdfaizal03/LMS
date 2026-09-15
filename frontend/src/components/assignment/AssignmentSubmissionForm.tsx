import React, { useState } from 'react';
import { Assignment, AssignmentSubmission } from '../../types';
import { assignmentApi, uploadApi } from '../../api';
import { useNotification } from '../../context/NotificationContext';
import {
  FileCheck, Upload, Calendar, Award, CheckCircle, Clock, FileText, Send
} from 'lucide-react';

interface AssignmentSubmissionFormProps {
  assignment: Assignment;
  onSubmitted?: (sub: AssignmentSubmission) => void;
}

export const AssignmentSubmissionForm: React.FC<AssignmentSubmissionFormProps> = ({
  assignment,
  onSubmitted,
}) => {
  const { showToast } = useNotification();
  const [submissionText, setSubmissionText] = useState<string>(
    assignment.my_submission?.submission_text || ''
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [currentSubmission, setCurrentSubmission] = useState<AssignmentSubmission | undefined>(
    assignment.my_submission
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionText.trim() && !selectedFile) {
      showToast('Please provide a written response or upload a file.', 'warning');
      return;
    }

    setIsUploading(true);
    try {
      let fileUrl = currentSubmission?.file_url;
      if (selectedFile) {
        const uploadRes = await uploadApi.uploadFile(selectedFile, 'assignments');
        fileUrl = uploadRes.url;
      }

      const sub = await assignmentApi.submitAssignment(assignment.id, {
        submission_text: submissionText,
        file_url: fileUrl,
      });

      setCurrentSubmission(sub);
      showToast('Assignment submitted successfully!', 'success');
      if (onSubmitted) onSubmitted(sub);
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Failed to submit assignment', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const isGraded = currentSubmission?.status === 'graded';

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Assignment Overview Card */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {assignment.title}
            </h3>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Award size={16} color="var(--primary)" />
                <span>Max Score: <strong>{assignment.max_marks} pts</strong></span>
              </div>
              {assignment.deadline && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={16} color="var(--warning)" />
                  <span>Due: <strong>{new Date(assignment.deadline).toLocaleDateString()}</strong></span>
                </div>
              )}
            </div>
          </div>

          {currentSubmission && (
            <span
              className={`badge ${isGraded ? 'badge-success' : 'badge-warning'}`}
              style={{ fontSize: '0.8125rem', padding: '6px 12px' }}
            >
              {isGraded ? `Graded: ${currentSubmission.grade}/${assignment.max_marks}` : 'Submitted'}
            </span>
          )}
        </div>

        <div style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6, borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Instructions:
          </h4>
          <p>{assignment.instructions || assignment.description}</p>
        </div>
      </div>

      {/* Grade & Feedback Card (if graded) */}
      {isGraded && (
        <div
          className="card"
          style={{
            backgroundColor: 'var(--success-light)',
            borderColor: 'var(--success)',
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
            <CheckCircle size={20} color="var(--success)" />
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Instructor Evaluation & Feedback
            </h4>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success)', marginBottom: '0.5rem' }}>
            Score: {currentSubmission.grade} / {assignment.max_marks} points
          </div>
          {currentSubmission.feedback && (
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <strong>Feedback:</strong> {currentSubmission.feedback}
            </p>
          )}
        </div>
      )}

      {/* Submission Form Card */}
      <div className="card">
        <h4 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>
          {currentSubmission ? 'Your Submission' : 'Submit Your Solution'}
        </h4>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Solution Text / Code / Repository URL</label>
            <textarea
              className="form-textarea"
              rows={5}
              placeholder="Paste your code explanation, GitHub link, or answers here..."
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              disabled={isGraded}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Attach File (Optional: .zip, .pdf, .docx, .png)</label>
            <input
              type="file"
              className="form-input"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedFile(e.target.files[0]);
                }
              }}
              disabled={isGraded}
            />
            {currentSubmission?.file_url && (
              <div style={{ marginTop: '6px', fontSize: '0.8125rem' }}>
                <a
                  href={currentSubmission.file_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'underline' }}
                >
                  View current attached submission file
                </a>
              </div>
            )}
          </div>

          {!isGraded && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                type="submit"
                disabled={isUploading}
                className="btn btn-primary"
              >
                <Send size={16} />
                {isUploading ? 'Submitting...' : currentSubmission ? 'Resubmit Assignment' : 'Submit Assignment'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
