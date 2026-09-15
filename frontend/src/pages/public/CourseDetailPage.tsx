import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Course, Lesson } from '../../types';
import { courseApi, enrollmentApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import { VideoPlayer } from '../../components/course/VideoPlayer';
import {
  Clock, BookOpen, Star, CheckCircle, Award, Video, FileText,
  HelpCircle, CheckSquare, Play, Lock, ChevronDown, ChevronUp, User, Globe,
  ShieldCheck, Smartphone, Download, Share2, Sparkles
} from 'lucide-react';

export const CourseDetailPage: React.FC = () => {
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const { user } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEnrolling, setIsEnrolling] = useState<boolean>(false);
  const [previewLesson, setPreviewLesson] = useState<Lesson | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!idOrSlug) return;
    setLoading(true);
    courseApi.getCourseDetail(idOrSlug)
      .then((data) => {
        setCourse(data);
        if (data.sections && data.sections.length > 0) {
          const initialExpanded: Record<number, boolean> = {};
          data.sections.forEach((sec, idx) => {
            if (idx === 0) initialExpanded[sec.id] = true;
          });
          setExpandedSections(initialExpanded);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        showToast('Course not found', 'error');
        setLoading(false);
      });
  }, [idOrSlug]);

  const toggleSection = (sectionId: number) => {
    setExpandedSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const expandAll = () => {
    if (!course?.sections) return;
    const allExp: Record<number, boolean> = {};
    course.sections.forEach((s) => { allExp[s.id] = true; });
    setExpandedSections(allExp);
  };

  const collapseAll = () => {
    setExpandedSections({});
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!course) return;

    setIsEnrolling(true);
    try {
      await enrollmentApi.enrollCourse(course.id);
      showToast('🎉 Successfully enrolled!', 'success');
      navigate(`/student/learn/${course.id}`);
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Failed to enroll', 'error');
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Course link copied to clipboard!', 'success');
    }
  };

  if (loading) return <LoadingSpinner message="Loading course details..." />;
  if (!course) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Course not found.</div>;

  const totalLessons = course.sections?.reduce((acc, s) => acc + (s.lessons?.length || 0), 0) || course.lessons_count || 0;

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
      {/* Top Breadcrumb & Hero Header */}
      <div
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
          paddingTop: '2.5rem',
          paddingBottom: '3rem',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            <Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
            <span>/</span>
            <Link to="/courses" style={{ color: 'var(--text-muted)' }}>Courses</Link>
            {course.category && (
              <>
                <span>/</span>
                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{course.category.name}</span>
              </>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '3rem', alignItems: 'flex-start' }}>
            {/* Left Header Info */}
            <div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                {course.category && (
                  <span className="badge badge-primary">{course.category.name}</span>
                )}
                <span className="badge badge-secondary" style={{ textTransform: 'capitalize' }}>
                  {course.difficulty_level.replace('_', ' ')}
                </span>
                <span className="badge badge-info" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Globe size={12} /> {course.language}
                </span>
              </div>

              <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                {course.title}
              </h1>

              <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.75rem', maxWidth: '780px' }}>
                {course.short_description}
              </p>

              {/* Meta stats bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', flexWrap: 'wrap', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    {course.instructor?.name?.charAt(0) || 'I'}
                  </div>
                  <span>Created by <strong>{course.instructor?.name || 'Lead Instructor'}</strong></span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', fontWeight: 700 }}>
                  <Star size={16} fill="#f59e0b" />
                  <span>{course.rating || 4.8}</span>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(1,420 ratings)</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BookOpen size={16} />
                  <span>{totalLessons} Lessons</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={16} />
                  <span>{course.duration_minutes || 360}m Total</span>
                </div>
              </div>
            </div>

            {/* Spacer for alignment on desktop since card floats down below */}
            <div style={{ display: 'none' }} />
          </div>
        </div>
      </div>

      {/* Main Content & Sticky Sidebar Layout */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '3rem', alignItems: 'start' }}>
          {/* Main Left Content Stream */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {/* 1. What You Will Learn Card */}
            {course.learning_objectives && course.learning_objectives.length > 0 && (
              <div
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '2rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
                  <Sparkles size={20} color="var(--primary)" />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    What you'll learn
                  </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                  {course.learning_objectives.map((obj, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      <CheckCircle size={18} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Course Curriculum */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    Course Curriculum
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
                    {course.sections?.length || 0} Modules &bull; {totalLessons} Lessons &bull; {course.duration_minutes || 360}m Total Length
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={expandAll}
                    type="button"
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Expand All
                  </button>
                  <span style={{ color: 'var(--border-color)' }}>|</span>
                  <button
                    onClick={collapseAll}
                    type="button"
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Collapse All
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {course.sections?.map((sec, sIdx) => {
                  const isExpanded = expandedSections[sec.id];
                  const secLessons = sec.lessons || [];
                  const secDuration = secLessons.reduce((acc, l) => acc + Math.round((l.duration_seconds || 600) / 60), 0);

                  return (
                    <div
                      key={sec.id}
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '1rem 1.25rem',
                          backgroundColor: isExpanded ? 'var(--bg-tertiary)' : 'transparent',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease',
                        }}
                        onClick={() => toggleSection(sec.id)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                            Module {sIdx + 1}: {sec.title}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                            {secLessons.length} lessons &bull; {secDuration}m
                          </span>
                          {isExpanded ? <ChevronUp size={18} color="var(--text-secondary)" /> : <ChevronDown size={18} color="var(--text-secondary)" />}
                        </div>
                      </div>

                      {isExpanded && (
                        <div style={{ padding: '0.5rem 1.25rem 0.75rem', borderTop: '1px solid var(--border-color)' }}>
                          {secLessons.map((les, lIdx) => (
                            <div
                              key={les.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '12px 0',
                                borderBottom: lIdx < secLessons.length - 1 ? '1px solid var(--border-color)' : 'none',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div
                                  style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '8px',
                                    backgroundColor: 'var(--primary-light)',
                                    color: 'var(--primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                  }}
                                >
                                  {les.lesson_type === 'video' && <Video size={16} />}
                                  {les.lesson_type === 'text' && <FileText size={16} />}
                                  {les.lesson_type === 'quiz' && <HelpCircle size={16} />}
                                  {les.lesson_type === 'assignment' && <CheckSquare size={16} />}
                                </div>
                                <div>
                                  <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                    {les.title}
                                  </span>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '8px', marginTop: '2px' }}>
                                    <span style={{ textTransform: 'capitalize' }}>{les.lesson_type}</span>
                                    <span>&bull;</span>
                                    <span>{Math.round((les.duration_seconds || 600) / 60)} min</span>
                                  </div>
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {les.is_preview ? (
                                  <button
                                    type="button"
                                    onClick={() => setPreviewLesson(les)}
                                    className="btn btn-outline btn-sm"
                                    style={{
                                      padding: '4px 10px',
                                      fontSize: '0.75rem',
                                      fontWeight: 600,
                                      borderRadius: '6px',
                                    }}
                                  >
                                    Preview <Play size={12} fill="currentColor" />
                                  </button>
                                ) : (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    <Lock size={14} />
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Requirements */}
            {course.requirements && course.requirements.length > 0 && (
              <div
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '2rem',
                }}
              >
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                  Requirements & Prerequisites
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {course.requirements.map((req, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)', flexShrink: 0 }} />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 4. Instructor Profile */}
            {course.instructor && (
              <div
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '2rem',
                }}
              >
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
                  About the Instructor
                </h3>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {course.instructor.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>
                      {course.instructor.name}
                    </h4>
                    {course.instructor.expertise && (
                      <div style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.75rem' }}>
                        {course.instructor.expertise}
                      </div>
                    )}
                    <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                      {course.instructor.bio || 'Experienced software professional and senior educator dedicated to creating world-class practical learning experiences.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sticky Enrollment Card */}
          <div style={{ position: 'sticky', top: '90px' }}>
            <div
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.15)',
                overflow: 'hidden',
              }}
            >
              {/* Thumbnail Container */}
              <div
                style={{
                  width: '100%',
                  aspectRatio: '16/9',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  marginBottom: '1.25rem',
                  backgroundColor: 'var(--bg-tertiary)',
                  position: 'relative',
                }}
              >
                <img
                  src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60'}
                  alt={course.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Price Row */}
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div>
                  {course.is_free || course.price === 0 ? (
                    <span style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--success)' }}>Free</span>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                      <span style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        ${course.price.toFixed(2)}
                      </span>
                      <span style={{ fontSize: '1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                        ${(course.price * 1.5).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
                <span className="badge badge-success" style={{ fontWeight: 700 }}>
                  {course.is_free || course.price === 0 ? 'Instant Access' : '33% OFF'}
                </span>
              </div>

              {/* CTA Action */}
              {course.is_enrolled ? (
                <Link
                  to={`/student/learn/${course.id}`}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', marginBottom: '1.25rem', justifyContent: 'center', fontSize: '1rem', fontWeight: 700 }}
                >
                  Continue Learning <Play size={18} fill="#ffffff" />
                </Link>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', marginBottom: '1.25rem', justifyContent: 'center', fontSize: '1rem', fontWeight: 700 }}
                >
                  {isEnrolling ? 'Enrolling...' : course.is_free ? 'Enroll for Free' : 'Enroll Now'}
                </button>
              )}

              <div style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                30-Day Money-Back Guarantee &bull; Full Lifetime Access
              </div>

              {/* Included Perks */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                  This course includes:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Video size={16} color="var(--primary)" />
                    <span>{course.duration_minutes || 360} minutes on-demand video</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <BookOpen size={16} color="var(--primary)" />
                    <span>{totalLessons} hands-on modules & lessons</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Smartphone size={16} color="var(--primary)" />
                    <span>Access on mobile and desktop</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Award size={16} color="var(--primary)" />
                    <span>Official Certificate of Completion</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ShieldCheck size={16} color="var(--primary)" />
                    <span>Verifiable cryptographic credential</span>
                  </div>
                </div>
              </div>

              {/* Share */}
              <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '1.25rem', paddingTop: '1rem', display: 'flex', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={handleShare}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                  }}
                >
                  <Share2 size={14} /> Share this course
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewLesson && (
        <Modal
          isOpen={true}
          onClose={() => setPreviewLesson(null)}
          title={`Preview: ${previewLesson.title}`}
          maxWidth="750px"
        >
          {previewLesson.lesson_type === 'video' && previewLesson.video_url ? (
            <VideoPlayer
              videoUrl={previewLesson.video_url}
              lessonId={previewLesson.id}
            />
          ) : (
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px', lineHeight: 1.6 }}>
              {previewLesson.content || 'Sample preview content for this lesson.'}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

