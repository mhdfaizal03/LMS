import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Course, Lesson, Quiz, Assignment } from '../../types';
import { courseApi, curriculumApi, enrollmentApi, quizApi, assignmentApi } from '../../api';
import { useNotification } from '../../context/NotificationContext';
import { VideoPlayer } from '../../components/course/VideoPlayer';
import { QuizTaker } from '../../components/quiz/QuizTaker';
import { AssignmentSubmissionForm } from '../../components/assignment/AssignmentSubmissionForm';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ProgressBar } from '../../components/common/ProgressBar';
import confetti from 'canvas-confetti';
import {
  Video, FileText, HelpCircle, CheckSquare, CheckCircle, Circle,
  ChevronLeft, ChevronRight, Menu, X, Award, Share2, ArrowLeft
} from 'lucide-react';

export const CourseLearnPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const lessonParam = searchParams.get('lesson');

  const [course, setCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [activeAssignment, setActiveAssignment] = useState<Assignment | null>(null);

  const [progressSummary, setProgressSummary] = useState<{
    total_lessons: number;
    completed_lessons: number;
    progress_percentage: number;
    is_completed: boolean;
    certificate_id?: string;
  }>({ total_lessons: 0, completed_lessons: 0, progress_percentage: 0, is_completed: false });

  const [loading, setLoading] = useState<boolean>(true);
  const [lessonLoading, setLessonLoading] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState<boolean>(true);

  // Fetch course & curriculum
  const loadCourseData = async () => {
    if (!courseId) return;
    try {
      const courseData = await courseApi.getCourseDetail(courseId);
      setCourse(courseData);

      const prog = await enrollmentApi.getCourseProgress(Number(courseId));
      setProgressSummary(prog);

      // Select initial lesson
      let targetLesson: Lesson | null = null;
      if (lessonParam) {
        targetLesson = findLessonById(courseData, Number(lessonParam));
      }
      if (!targetLesson && courseData.sections && courseData.sections[0]?.lessons?.[0]) {
        targetLesson = courseData.sections[0].lessons[0];
      }

      if (targetLesson) {
        selectLesson(targetLesson.id);
      }
    } catch (err) {
      console.error(err);
      showToast('Could not load course. Please ensure you are enrolled.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourseData();
  }, [courseId]);

  const findLessonById = (c: Course, id: number): Lesson | null => {
    for (const sec of c.sections || []) {
      for (const les of sec.lessons || []) {
        if (les.id === id) return les;
      }
    }
    return null;
  };

  const selectLesson = async (lessonId: number) => {
    setLessonLoading(true);
    try {
      const les = await curriculumApi.getLessonDetail(lessonId);
      setActiveLesson(les);
      setSearchParams({ lesson: String(lessonId) });

      // If lesson is quiz, load quiz details
      if (les.lesson_type === 'quiz') {
        const q = await quizApi.getLessonQuiz(lessonId);
        setActiveQuiz(q);
      } else {
        setActiveQuiz(null);
      }

      // If lesson is assignment, load assignment details
      if (les.lesson_type === 'assignment') {
        const a = await assignmentApi.getLessonAssignment(lessonId);
        setActiveAssignment(a);
      } else {
        setActiveAssignment(null);
      }
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Failed to load lesson', 'error');
    } finally {
      setLessonLoading(false);
    }
  };

  const handleToggleComplete = async () => {
    if (!activeLesson) return;
    const nextState = !activeLesson.is_completed;
    try {
      await enrollmentApi.updateProgress(activeLesson.id, {
        is_completed: nextState,
        last_position_seconds: activeLesson.duration_seconds || 0,
      });

      setActiveLesson((prev) => (prev ? { ...prev, is_completed: nextState } : null));
      const prog = await enrollmentApi.getCourseProgress(Number(courseId));
      setProgressSummary(prog);

      if (nextState) {
        showToast('Lesson marked as completed!', 'success');
        if (prog.is_completed && prog.certificate_id) {
          confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
          showToast('🎓 Congratulations! You completed the course and earned a Certificate!', 'success');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const allLessons: Lesson[] = [];
  course?.sections?.forEach((s) => s.lessons?.forEach((l) => allLessons.push(l)));
  const currentIndex = allLessons.findIndex((l) => l.id === activeLesson?.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  if (loading) return <LoadingSpinner message="Loading your classroom..." />;
  if (!course) return <div style={{ padding: '3rem', textAlign: 'center' }}>Course not found.</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 68px)', overflow: 'hidden' }}>
      {/* Top Classroom Bar */}
      <div
        style={{
          height: '60px',
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          zIndex: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/student/courses" className="btn-icon" title="Back to My Courses">
            <ArrowLeft size={18} />
          </Link>
          <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)', maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {course.title}
          </span>
        </div>

        {/* Progress bar & Certificate Link */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '180px', display: 'none', alignItems: 'center', gap: '8px' }} className="desktop-progress">
            <ProgressBar percentage={progressSummary.progress_percentage} showLabel={false} height={6} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              {progressSummary.progress_percentage}%
            </span>
          </div>

          {progressSummary.is_completed && progressSummary.certificate_id && (
            <Link
              to={`/verify-certificate/${progressSummary.certificate_id}`}
              className="btn btn-sm"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#ffffff',
                fontWeight: 700,
              }}
            >
              <Award size={16} /> View Certificate
            </Link>
          )}

          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="btn btn-secondary btn-sm"
          >
            {showSidebar ? <X size={16} /> : <Menu size={16} />}
            <span>Curriculum</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        {/* Left/Center: Lesson Player & Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem 1.5rem', backgroundColor: 'var(--bg-primary)' }}>
          <div style={{ maxWidth: '950px', margin: '0 auto' }}>
            {lessonLoading ? (
              <LoadingSpinner message="Loading lesson content..." />
            ) : !activeLesson ? (
              <div style={{ textAlign: 'center', padding: '4rem 0' }}>Select a lesson from the curriculum to begin.</div>
            ) : (
              <div>
                {/* Lesson Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                    {activeLesson.title}
                  </h2>
                  <button
                    onClick={handleToggleComplete}
                    className={`btn btn-sm ${activeLesson.is_completed ? 'btn-success' : 'btn-secondary'}`}
                  >
                    <CheckCircle size={16} />
                    {activeLesson.is_completed ? 'Completed' : 'Mark Complete'}
                  </button>
                </div>

                {/* Content Renderer by Type */}
                <div style={{ marginBottom: '2.5rem' }}>
                  {activeLesson.lesson_type === 'video' && activeLesson.video_url && (
                    <VideoPlayer
                      videoUrl={activeLesson.video_url}
                      lessonId={activeLesson.id}
                      initialPosition={activeLesson.last_position_seconds || 0}
                      isCompleted={activeLesson.is_completed}
                      onLessonCompleted={() => {
                        setActiveLesson((prev) => (prev ? { ...prev, is_completed: true } : null));
                        enrollmentApi.getCourseProgress(Number(courseId)).then(setProgressSummary);
                      }}
                    />
                  )}

                  {activeLesson.lesson_type === 'text' && (
                    <div className="card" style={{ padding: '2rem', lineHeight: 1.7, fontSize: '1rem', whiteSpace: 'pre-wrap' }}>
                      {activeLesson.content || 'Reading lesson content.'}
                    </div>
                  )}

                  {activeLesson.lesson_type === 'quiz' && (
                    activeQuiz ? (
                      <QuizTaker
                        quiz={activeQuiz}
                        onQuizCompleted={() => {
                          setActiveLesson((prev) => (prev ? { ...prev, is_completed: true } : null));
                          enrollmentApi.getCourseProgress(Number(courseId)).then(setProgressSummary);
                        }}
                      />
                    ) : (
                      <LoadingSpinner message="Loading quiz questions..." />
                    )
                  )}

                  {activeLesson.lesson_type === 'assignment' && (
                    activeAssignment ? (
                      <AssignmentSubmissionForm
                        assignment={activeAssignment}
                        onSubmitted={() => {
                          showToast('Assignment response recorded', 'info');
                        }}
                      />
                    ) : (
                      <LoadingSpinner message="Loading assignment specifications..." />
                    )
                  )}
                </div>

                {/* Next / Previous Navigation Footer */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid var(--border-color)',
                  }}
                >
                  {prevLesson ? (
                    <button
                      onClick={() => selectLesson(prevLesson.id)}
                      className="btn btn-secondary"
                    >
                      <ChevronLeft size={16} /> Previous: {prevLesson.title}
                    </button>
                  ) : <div />}

                  {nextLesson ? (
                    <button
                      onClick={() => selectLesson(nextLesson.id)}
                      className="btn btn-primary"
                    >
                      Next: {nextLesson.title} <ChevronRight size={16} />
                    </button>
                  ) : <div />}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Collapsible Curriculum Sidebar */}
        {showSidebar && (
          <div
            style={{
              width: '360px',
              backgroundColor: 'var(--bg-secondary)',
              borderLeft: '1px solid var(--border-color)',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              flexShrink: 0,
            }}
          >
            <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Course Curriculum</h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {progressSummary.completed_lessons} of {progressSummary.total_lessons} lessons completed ({progressSummary.progress_percentage}%)
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {course.sections?.map((sec, sIdx) => (
                <div key={sec.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ padding: '10px 14px', backgroundColor: 'var(--bg-tertiary)', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    Section {sIdx + 1}: {sec.title}
                  </div>
                  <div>
                    {sec.lessons?.map((les, lIdx) => {
                      const isActive = activeLesson?.id === les.id;
                      return (
                        <div
                          key={les.id}
                          onClick={() => selectLesson(les.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '12px 14px',
                            backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                            borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                            cursor: 'pointer',
                            transition: 'background-color 0.15s ease',
                          }}
                        >
                          <span style={{ color: les.is_completed ? 'var(--success)' : 'var(--text-muted)' }}>
                            {les.is_completed ? <CheckCircle size={16} color="var(--success)" /> : <Circle size={16} />}
                          </span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.8125rem', fontWeight: isActive ? 700 : 500, color: isActive ? 'var(--primary)' : 'var(--text-primary)' }}>
                              {lIdx + 1}. {les.title}
                            </div>
                            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                              {les.lesson_type} &bull; {les.duration_seconds ? `${Math.floor(les.duration_seconds / 60)}m` : '5m'}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
