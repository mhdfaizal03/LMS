import React, { useState, useEffect } from 'react';
import { enrollmentApi } from '../../api';
import { Enrollment } from '../../types';
import { CourseCard } from '../../components/course/CourseCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { BookOpen } from 'lucide-react';

export const MyCoursesPage: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'completed'>('all');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    enrollmentApi.getMyCourses()
      .then((data) => {
        setEnrollments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filtered = enrollments.filter((e) => {
    if (filter === 'in_progress') return e.progress_percentage < 100 && e.status !== 'completed';
    if (filter === 'completed') return e.progress_percentage >= 100 || e.status === 'completed';
    return true;
  });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>My Enrolled Courses</h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
            Track your ongoing curriculum, video playback positions, and completed modules.
          </p>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '4px', gap: '4px' }}>
          <button
            onClick={() => setFilter('all')}
            className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none' }}
          >
            All ({enrollments.length})
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`btn btn-sm ${filter === 'in_progress' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none' }}
          >
            In Progress ({enrollments.filter((e) => e.progress_percentage < 100).length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`btn btn-sm ${filter === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none' }}
          >
            Completed ({enrollments.filter((e) => e.progress_percentage >= 100).length})
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading your courses..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses in this tab"
          description="Start learning new skills by enrolling in courses from our catalog."
          actionText="Browse Courses"
          onAction={() => (window.location.href = '/courses')}
        />
      ) : (
        <div className="grid-3">
          {filtered.map((enr) => enr.course && (
            <CourseCard
              key={enr.id}
              course={{ ...enr.course, is_enrolled: true, progress_percentage: enr.progress_percentage }}
              showProgress={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};
