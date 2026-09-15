import React, { useState } from 'react';
import {
  FileCheck2, BookOpen, FileText, Brain, MoreHorizontal,
  Plus, Check, X, UploadCloud, MessageSquare, Users
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export interface LectureTask {
  id: number;
  title: string;
  type: 'Task' | 'Theory';
  course: string;
  instructor: string;
  theme: 'mint' | 'yellow' | 'purple';
  actionType: 'add_create' | 'mark_done';
  isDone?: boolean;
}

interface LectureTaskListProps {
  onSelectTask?: (task: LectureTask) => void;
}

export const LectureTaskList: React.FC<LectureTaskListProps> = ({ onSelectTask }) => {
  const { showToast } = useNotification();
  const [activeTab, setActiveTab] = useState<'forum' | 'todo' | 'members'>('forum');
  const [tasks, setTasks] = useState<LectureTask[]>([
    {
      id: 1,
      title: 'Quiz if you become a motivator',
      type: 'Task',
      course: 'Biography',
      instructor: 'Mrs Diana Smith',
      theme: 'mint',
      actionType: 'add_create',
      isDone: false,
    },
    {
      id: 2,
      title: 'The life story of a motivator',
      type: 'Theory',
      course: 'Biography',
      instructor: 'Mrs Diana Smith',
      theme: 'mint',
      actionType: 'mark_done',
      isDone: false,
    },
    {
      id: 3,
      title: 'Algebra property assignments',
      type: 'Task',
      course: 'Math',
      instructor: 'Mr Jhon Lock',
      theme: 'yellow',
      actionType: 'add_create',
      isDone: false,
    },
    {
      id: 4,
      title: 'Theory of Algebraic properties',
      type: 'Theory',
      course: 'Math',
      instructor: 'Mr Jhon Lock',
      theme: 'yellow',
      actionType: 'mark_done',
      isDone: false,
    },
    {
      id: 5,
      title: "How to determine someone's IQ",
      type: 'Theory',
      course: 'Psychology',
      instructor: 'Mr Malvin Ruslan',
      theme: 'purple',
      actionType: 'mark_done',
      isDone: false,
    },
  ]);

  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [modalTask, setModalTask] = useState<LectureTask | null>(null);
  const [submissionText, setSubmissionText] = useState<string>('');

  const handleToggleDone = (taskId: number) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const newStatus = !t.isDone;
          showToast(newStatus ? `Marked "${t.title}" as completed!` : `Task marked as pending`, 'success');
          return { ...t, isDone: newStatus };
        }
        return t;
      })
    );
  };

  const handleAddOrCreate = (task: LectureTask) => {
    setModalTask(task);
  };

  const handleSubmitModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalTask) return;
    showToast(`Submission uploaded for "${modalTask.title}"!`, 'success');
    setTasks((prev) =>
      prev.map((t) => (t.id === modalTask.id ? { ...t, isDone: true } : t))
    );
    setModalTask(null);
    setSubmissionText('');
  };

  const getTaskIcon = (task: LectureTask) => {
    switch (task.theme) {
      case 'mint':
        return task.type === 'Task' ? <FileCheck2 size={18} /> : <BookOpen size={18} />;
      case 'yellow':
        return task.type === 'Task' ? <FileText size={18} /> : <BookOpen size={18} />;
      case 'purple':
        return <Brain size={18} />;
    }
  };

  const getIconBg = (theme: 'mint' | 'yellow' | 'purple') => {
    switch (theme) {
      case 'mint':
        return { bg: '#e8f7f2', color: '#10b981' };
      case 'yellow':
        return { bg: '#fff8e7', color: '#f59e0b' };
      case 'purple':
        return { bg: '#f0f1fd', color: '#6366f1' };
    }
  };

  return (
    <div>
      {/* Section Header */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'inherit' }}>
          Today Tasks<span className="lecture-dot">.</span>
        </h2>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #f1f5f9', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setActiveTab('forum')}
          className={`lecture-tab ${activeTab === 'forum' ? 'active' : ''}`}
        >
          Forum
        </button>
        <button
          onClick={() => setActiveTab('todo')}
          className={`lecture-tab ${activeTab === 'todo' ? 'active' : ''}`}
        >
          To - do
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`lecture-tab ${activeTab === 'members' ? 'active' : ''}`}
        >
          Members
        </button>
      </div>

      {/* Tab Content: Forum & Tasks */}
      {activeTab === 'forum' || activeTab === 'todo' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {tasks.map((task, index) => {
            const iconStyle = getIconBg(task.theme);
            const isLast = index === tasks.length - 1;

            return (
              <div
                key={task.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.1rem 0',
                  borderBottom: isLast ? 'none' : '1px solid #f1f5f9',
                  gap: '1rem',
                  opacity: task.isDone ? 0.65 : 1,
                  transition: 'opacity 0.2s ease',
                }}
              >
                {/* Left side: Icon + Title & Course */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      backgroundColor: iconStyle.bg,
                      color: iconStyle.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {getTaskIcon(task)}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: '0.9375rem',
                          color: 'inherit',
                          textDecoration: task.isDone ? 'line-through' : 'none',
                        }}
                      >
                        {task.title}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
                        • {task.type}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '2px' }}>
                      <strong style={{ color: 'inherit' }}>{task.course}</strong> . {task.instructor}
                    </div>
                  </div>
                </div>

                {/* Right side: Options Menu & Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0, position: 'relative' }}>
                  {/* Three Dots Button */}
                  <button
                    onClick={() => setActiveMenuId(activeMenuId === task.id ? null : task.id)}
                    className="btn-icon"
                    style={{ color: '#94a3b8', width: '32px', height: '32px' }}
                    aria-label="Task options"
                  >
                    <MoreHorizontal size={18} />
                  </button>

                  {/* Dropdown Menu */}
                  {activeMenuId === task.id && (
                    <div
                      className="card"
                      style={{
                        position: 'absolute',
                        right: '120px',
                        top: '40px',
                        zIndex: 50,
                        width: '160px',
                        padding: '6px',
                        boxShadow: 'var(--shadow-lg)',
                      }}
                    >
                      <button
                        onClick={() => {
                          showToast(`Opened resources for ${task.title}`, 'info');
                          setActiveMenuId(null);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 10px',
                          border: 'none',
                          background: 'transparent',
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          borderRadius: '6px',
                          cursor: 'pointer',
                        }}
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => {
                          handleToggleDone(task.id);
                          setActiveMenuId(null);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 10px',
                          border: 'none',
                          background: 'transparent',
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          borderRadius: '6px',
                          cursor: 'pointer',
                        }}
                      >
                        {task.isDone ? 'Mark Incomplete' : 'Mark Completed'}
                      </button>
                    </div>
                  )}

                  {/* Button: + Add or Create OR Mark as Done */}
                  {task.actionType === 'add_create' ? (
                    <button
                      onClick={() => handleAddOrCreate(task)}
                      className="btn-lecture-coral"
                    >
                      <Plus size={14} /> Add or Create
                    </button>
                  ) : (
                    <button
                      onClick={() => handleToggleDone(task.id)}
                      className="btn-lecture-peach"
                    >
                      {task.isDone ? '✓ Completed' : 'Mark as Done'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Members Tab View */
        <div style={{ padding: '1rem 0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { name: 'Mrs Diana Smith', role: 'Teacher', course: 'Biography' },
              { name: 'Mr Jhon Lock', role: 'Teacher', course: 'Math' },
              { name: 'Mr Malvin Ruslan', role: 'Teacher', course: 'Psychology' },
              { name: 'Emma Watson', role: 'Student (You)', course: 'All Classes' },
              { name: 'Alex Johnson', role: 'Student', course: 'Biography' },
            ].map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem' }}>
                    {m.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{m.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{m.course}</div>
                  </div>
                </div>
                <span className="badge badge-secondary">{m.role}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submission Modal for "+ Add or Create" */}
      {modalTask && (
        <div className="modal-backdrop" onClick={() => setModalTask(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Submit Work / Task</h3>
                <p style={{ fontSize: '0.8125rem', color: '#94a3b8', marginTop: '2px' }}>
                  {modalTask.title} &bull; {modalTask.course}
                </p>
              </div>
              <button onClick={() => setModalTask(null)} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitModal}>
              <div className="form-group">
                <label className="form-label">Task Response / Answer Notes</label>
                <textarea
                  required
                  rows={4}
                  className="form-input"
                  placeholder="Enter your summary, calculations, or answer notes here..."
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                />
              </div>

              <div
                style={{
                  border: '2px dashed var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem',
                  textAlign: 'center',
                  marginBottom: '1.5rem',
                  backgroundColor: 'var(--bg-tertiary)',
                  cursor: 'pointer',
                }}
              >
                <UploadCloud size={28} color="var(--lecture-coral)" style={{ margin: '0 auto 8px' }} />
                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Drag & drop assignment attachment or click to browse</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>PDF, DOCX, ZIP up to 25MB</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" onClick={() => setModalTask(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-lecture-coral">
                  Submit Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
