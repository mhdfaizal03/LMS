import React, { useState } from 'react';
import { Section, Lesson, LessonType } from '../../types';
import { curriculumApi, quizApi, assignmentApi } from '../../api';
import { useNotification } from '../../context/NotificationContext';
import { Modal } from '../common/Modal';
import {
  Plus, Trash2, Edit2, Video, FileText, File, HelpCircle, CheckSquare,
  ChevronDown, ChevronUp, Clock, Eye, Layers
} from 'lucide-react';

interface CurriculumBuilderProps {
  courseId: number;
  sections: Section[];
  onRefresh: () => void;
}

export const CurriculumBuilder: React.FC<CurriculumBuilderProps> = ({
  courseId,
  sections,
  onRefresh,
}) => {
  const { showToast } = useNotification();

  // Section Modal
  const [showSectionModal, setShowSectionModal] = useState<boolean>(false);
  const [sectionTitle, setSectionTitle] = useState<string>('');
  const [sectionDescription, setSectionDescription] = useState<string>('');
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);

  // Lesson Modal
  const [showLessonModal, setShowLessonModal] = useState<boolean>(false);
  const [targetSectionId, setTargetSectionId] = useState<number | null>(null);
  const [lessonTitle, setLessonTitle] = useState<string>('');
  const [lessonType, setLessonType] = useState<LessonType>('video');
  const [lessonContent, setLessonContent] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [durationSeconds, setDurationSeconds] = useState<number>(300);
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);

  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});

  const toggleExpand = (secId: number) => {
    setExpandedSections((prev) => ({ ...prev, [secId]: !prev[secId] }));
  };

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSectionId) {
        await curriculumApi.updateSection(editingSectionId, {
          title: sectionTitle,
          description: sectionDescription,
        });
        showToast('Section updated successfully', 'success');
      } else {
        await curriculumApi.createSection(courseId, {
          title: sectionTitle,
          description: sectionDescription,
        });
        showToast('Section created successfully', 'success');
      }
      setShowSectionModal(false);
      setSectionTitle('');
      setSectionDescription('');
      setEditingSectionId(null);
      onRefresh();
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Failed to save section', 'error');
    }
  };

  const handleDeleteSection = async (secId: number) => {
    if (!window.confirm('Are you sure you want to delete this module and all its lessons?')) return;
    try {
      await curriculumApi.deleteSection(secId);
      showToast('Section deleted', 'info');
      onRefresh();
    } catch (err: any) {
      showToast('Failed to delete section', 'error');
    }
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetSectionId && !editingLessonId) return;

    try {
      const payload: Partial<Lesson> = {
        title: lessonTitle,
        lesson_type: lessonType,
        content: lessonContent,
        video_url: videoUrl,
        duration_seconds: durationSeconds,
        is_preview: isPreview,
      };

      if (editingLessonId) {
        await curriculumApi.updateLesson(editingLessonId, payload);
        showToast('Lesson updated', 'success');
      } else if (targetSectionId) {
        const created = await curriculumApi.createLesson(targetSectionId, payload);
        // If lesson type is quiz or assignment, create default container
        if (lessonType === 'quiz') {
          await quizApi.createQuiz(courseId, {
            title: `${lessonTitle} Quiz`,
            description: 'Assess understanding of key concepts',
            time_limit_minutes: 15,
            passing_score: 70.0,
            max_attempts: 3,
            questions: [
              {
                question_text: 'Sample question: Is this answer correct?',
                question_type: 'true_false',
                options: [{ id: 'true', text: 'True' }, { id: 'false', text: 'False' }],
                correct_answers: ['true'],
                marks: 1.0,
              }
            ]
          }, created.id);
        } else if (lessonType === 'assignment') {
          await assignmentApi.createAssignment(courseId, {
            title: `${lessonTitle} Assignment`,
            description: 'Hands-on practical project assignment',
            instructions: 'Submit your solution or code repository URL.',
            max_marks: 100.0,
          }, created.id);
        }
        showToast('Lesson created', 'success');
      }

      setShowLessonModal(false);
      setEditingLessonId(null);
      setLessonTitle('');
      setLessonContent('');
      setVideoUrl('');
      onRefresh();
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Failed to save lesson', 'error');
    }
  };

  const handleDeleteLesson = async (lesId: number) => {
    if (!window.confirm('Delete this lesson?')) return;
    try {
      await curriculumApi.deleteLesson(lesId);
      showToast('Lesson deleted', 'info');
      onRefresh();
    } catch (err) {
      showToast('Failed to delete lesson', 'error');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Curriculum & Modules</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Organize your course into structured sections and interactive lessons.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingSectionId(null);
            setSectionTitle('');
            setSectionDescription('');
            setShowSectionModal(true);
          }}
          className="btn btn-primary btn-sm"
        >
          <Plus size={16} /> Add Module / Section
        </button>
      </div>

      {sections.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', borderStyle: 'dashed' }}>
          <Layers size={36} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>No sections added yet</h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Start by creating your first module/section.
          </p>
          <button
            type="button"
            onClick={() => setShowSectionModal(true)}
            className="btn btn-primary btn-sm"
          >
            Create First Section
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {sections.map((section, sIndex) => {
            const isExpanded = expandedSections[section.id] !== false; // expanded by default
            return (
              <div key={section.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                {/* Section Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 1.25rem',
                    backgroundColor: 'var(--bg-tertiary)',
                    borderBottom: isExpanded ? '1px solid var(--border-color)' : 'none',
                    cursor: 'pointer',
                  }}
                  onClick={() => toggleExpand(section.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--primary)' }}>
                      Section {sIndex + 1}:
                    </span>
                    <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                      {section.title}
                    </span>
                    <span className="badge badge-secondary" style={{ fontSize: '0.6875rem' }}>
                      {section.lessons?.length || 0} Lessons
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => {
                        setTargetSectionId(section.id);
                        setEditingLessonId(null);
                        setLessonTitle('');
                        setLessonContent('');
                        setVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
                        setShowLessonModal(true);
                      }}
                      className="btn btn-primary btn-sm"
                    >
                      <Plus size={14} /> Add Lesson
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSectionId(section.id);
                        setSectionTitle(section.title);
                        setSectionDescription(section.description || '');
                        setShowSectionModal(true);
                      }}
                      className="btn-icon"
                      title="Edit Section"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSection(section.id)}
                      className="btn-icon"
                      style={{ color: 'var(--danger)' }}
                      title="Delete Section"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleExpand(section.id)}
                      className="btn-icon"
                    >
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                </div>

                {/* Lessons in Section */}
                {isExpanded && (
                  <div style={{ padding: '0.75rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {(!section.lessons || section.lessons.length === 0) ? (
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', padding: '0.75rem 0' }}>
                        No lessons in this section yet. Click "Add Lesson" above.
                      </p>
                    ) : (
                      section.lessons.map((lesson, lIndex) => (
                        <div
                          key={lesson.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 14px',
                            backgroundColor: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ color: 'var(--primary)' }}>
                              {lesson.lesson_type === 'video' && <Video size={16} />}
                              {lesson.lesson_type === 'text' && <FileText size={16} />}
                              {lesson.lesson_type === 'pdf' && <File size={16} />}
                              {lesson.lesson_type === 'quiz' && <HelpCircle size={16} />}
                              {lesson.lesson_type === 'assignment' && <CheckSquare size={16} />}
                            </span>
                            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                              {lIndex + 1}. {lesson.title}
                            </span>
                            <span className="badge badge-info" style={{ fontSize: '0.6875rem', textTransform: 'capitalize' }}>
                              {lesson.lesson_type}
                            </span>
                            {lesson.is_preview && (
                              <span className="badge badge-success" style={{ fontSize: '0.6875rem' }}>
                                Free Preview
                              </span>
                            )}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingLessonId(lesson.id);
                                setLessonTitle(lesson.title);
                                setLessonType(lesson.lesson_type);
                                setLessonContent(lesson.content || '');
                                setVideoUrl(lesson.video_url || '');
                                setDurationSeconds(lesson.duration_seconds || 300);
                                setIsPreview(lesson.is_preview);
                                setShowLessonModal(true);
                              }}
                              className="btn-icon"
                              title="Edit Lesson"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteLesson(lesson.id)}
                              className="btn-icon"
                              style={{ color: 'var(--danger)' }}
                              title="Delete Lesson"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Section Modal */}
      <Modal
        isOpen={showSectionModal}
        onClose={() => setShowSectionModal(false)}
        title={editingSectionId ? 'Edit Section' : 'Add New Section'}
      >
        <form onSubmit={handleSaveSection}>
          <div className="form-group">
            <label className="form-label">Section Title</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Module 1: Core Fundamentals"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <textarea
              className="form-textarea"
              placeholder="Summary of what this module covers"
              value={sectionDescription}
              onChange={(e) => setSectionDescription(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setShowSectionModal(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingSectionId ? 'Update Section' : 'Create Section'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Lesson Modal */}
      <Modal
        isOpen={showLessonModal}
        onClose={() => setShowLessonModal(false)}
        title={editingLessonId ? 'Edit Lesson' : 'Add New Lesson'}
      >
        <form onSubmit={handleSaveLesson}>
          <div className="form-group">
            <label className="form-label">Lesson Title</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Introduction to Async Architecture"
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Lesson Content Type</label>
            <select
              className="form-select"
              value={lessonType}
              onChange={(e) => setLessonType(e.target.value as LessonType)}
            >
              <option value="video">Video Lecture</option>
              <option value="text">Rich Reading / Markdown</option>
              <option value="quiz">Interactive Quiz</option>
              <option value="assignment">Project Assignment</option>
            </select>
          </div>

          {lessonType === 'video' && (
            <>
              <div className="form-group">
                <label className="form-label">Video Stream / File URL</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://.../video.mp4"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Duration (seconds)</label>
                <input
                  type="number"
                  className="form-input"
                  value={durationSeconds}
                  onChange={(e) => setDurationSeconds(Number(e.target.value))}
                />
              </div>
            </>
          )}

          {lessonType === 'text' && (
            <div className="form-group">
              <label className="form-label">Text & Markdown Content</label>
              <textarea
                className="form-textarea"
                rows={6}
                placeholder="Write lesson explanation, code snippets, notes..."
                value={lessonContent}
                onChange={(e) => setLessonContent(e.target.value)}
              />
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '1rem 0' }}>
            <input
              type="checkbox"
              id="previewCheck"
              checked={isPreview}
              onChange={(e) => setIsPreview(e.target.checked)}
              style={{ width: '18px', height: '18px' }}
            />
            <label htmlFor="previewCheck" style={{ fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
              Allow Free Preview (Students can view before enrolling)
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setShowLessonModal(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingLessonId ? 'Save Changes' : 'Add Lesson'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
