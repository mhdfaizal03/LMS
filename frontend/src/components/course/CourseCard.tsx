import React from 'react';
import { Link } from 'react-router-dom';
import { Course } from '../../types';
import { ProgressBar } from '../common/ProgressBar';
import { Clock, BookOpen, User as UserIcon, Star, CheckCircle } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  showProgress?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, showProgress = false }) => {
  const isEnrolled = course.is_enrolled || showProgress;
  const progress = course.progress_percentage || 0;

  // Placeholder thumbnail gradient if none provided
  const defaultThumbnail = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60';

  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '0', overflow: 'hidden' }}>
      {/* Thumbnail */}
      <div style={{ position: 'relative', width: '100%', height: '180px', backgroundColor: 'var(--bg-tertiary)' }}>
        <img
          src={course.thumbnail || defaultThumbnail}
          alt={course.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* Category & Difficulty Badges */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
          {course.category && (
            <span className="badge badge-primary" style={{ backgroundColor: 'rgba(79, 70, 229, 0.9)', color: '#ffffff' }}>
              {course.category.name}
            </span>
          )}
        </div>
        <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
          <span className="badge badge-secondary" style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', color: '#ffffff', textTransform: 'capitalize' }}>
            {(course.difficulty_level || 'beginner').replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3
          style={{
            fontSize: '1.0625rem',
            fontWeight: 700,
            lineHeight: 1.4,
            marginBottom: '0.5rem',
            color: 'var(--text-primary)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          <Link to={`/courses/${course.slug || course.id}`} style={{ color: 'inherit' }}>
            {course.title}
          </Link>
        </h3>

        <p
          style={{
            fontSize: '0.8125rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {course.short_description || 'Master this course with hands-on projects, interactive quizzes, and practical assignments.'}
        </p>

        {/* Instructor */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.6875rem',
              fontWeight: 700,
            }}
          >
            {course.instructor?.name.charAt(0) || 'I'}
          </div>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            {course.instructor?.name || 'Lead Instructor'}
          </span>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-color)',
            marginTop: 'auto',
            marginBottom: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <BookOpen size={14} />
            <span>{course.lessons_count || 0} Lessons</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={14} />
            <span>{course.duration_minutes || 60}m</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontWeight: 600 }}>
            <Star size={14} fill="#f59e0b" />
            <span>{course.rating || 4.8}</span>
          </div>
        </div>

        {/* Enrolled Progress or Price Action */}
        {isEnrolled ? (
          <div>
            <ProgressBar percentage={progress} showLabel={true} />
            <Link
              to={`/student/learn/${course.id}`}
              className="btn btn-primary btn-sm"
              style={{ width: '100%', marginTop: '0.75rem' }}
            >
              {progress >= 100 ? 'Review Course' : 'Continue Learning'}
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem' }}>
            <div>
              {course.is_free || !course.price ? (
                <span style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--success)' }}>Free</span>
              ) : (
                <span style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  ${Number(course.price).toFixed(2)}
                </span>
              )}
            </div>
            <Link to={`/courses/${course.slug || course.id}`} className="btn btn-primary btn-sm">
              View Details
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
