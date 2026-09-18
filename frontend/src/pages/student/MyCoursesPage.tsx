import React, { useState, useEffect } from 'react';
import { enrollmentApi } from '../../api';
import { Enrollment } from '../../types';
import { CourseCard } from '../../components/course/CourseCard';
import { CourseCardSkeleton } from '../../components/ui/Skeletons';
import EmptyState from '../../components/ui/EmptyState';
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
    <div className="space-y-6 max-w-[1200px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="font-display text-xl font-800 text-slate-900">My Enrolled Courses</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Track your ongoing curriculum, video playback positions, and completed modules.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex bg-white border border-slate-200 rounded-xl p-1 gap-1 shadow-sm">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            All ({enrollments.length})
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'in_progress' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            In Progress ({enrollments.filter((e) => e.progress_percentage < 100).length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'completed' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Completed ({enrollments.filter((e) => e.progress_percentage >= 100).length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => <CourseCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 premium-shadow">
          <EmptyState
            icon={BookOpen}
            title="No courses in this tab"
            description="Start learning new skills by enrolling in courses from our catalog."
            actionLabel="Browse Courses"
            onAction={() => (window.location.href = '/courses')}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
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
