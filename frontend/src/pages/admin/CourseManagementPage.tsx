import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseApi } from '../../api';
import { Course } from '../../types';
import { useNotification } from '../../context/NotificationContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import {
  BookOpen, Edit, Trash2, ExternalLink, CheckCircle, Clock
} from 'lucide-react';

export const CourseManagementPage: React.FC = () => {
  const { showToast } = useNotification();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteCourseId, setDeleteCourseId] = useState<number | null>(null);

  const loadCourses = () => {
    setLoading(true);
    courseApi.getCourses({ limit: 100 })
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleTogglePublish = async (course: Course) => {
    const nextStatus = course.status === 'published' ? 'draft' : 'published';
    try {
      await courseApi.updateCourse(course.id, { status: nextStatus });
      showToast(`Course status updated to ${nextStatus}`, 'success');
      loadCourses();
    } catch (err: any) {
      showToast('Failed to update course status', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteCourseId) return;
    try {
      await courseApi.deleteCourse(deleteCourseId);
      showToast('Course permanently deleted', 'info');
      setDeleteCourseId(null);
      loadCourses();
    } catch (err: any) {
      showToast('Failed to delete course', 'error');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Course Moderation & Catalog</h1>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
          Review, moderate, publish, unpublish, and manage all courses across the entire platform.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading all courses..." />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Instructor</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{course.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {course.lessons_count || 0} Lessons &bull; {course.students_count || 0} Enrolled
                    </div>
                  </td>
                  <td>{course.instructor?.name || 'Instructor'}</td>
                  <td>{course.category?.name || 'Uncategorized'}</td>
                  <td>{course.is_free ? 'Free' : `$${course.price.toFixed(2)}`}</td>
                  <td>
                    <button
                      onClick={() => handleTogglePublish(course)}
                      className={`badge ${course.status === 'published' ? 'badge-success' : 'badge-warning'}`}
                      style={{ border: 'none', cursor: 'pointer' }}
                      title="Click to toggle publish status"
                    >
                      {course.status}
                    </button>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                      <Link to={`/courses/${course.slug || course.id}`} className="btn-icon" target="_blank">
                        <ExternalLink size={16} />
                      </Link>
                      <button
                        onClick={() => setDeleteCourseId(course.id)}
                        className="btn-icon"
                        style={{ color: 'var(--danger)' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteCourseId !== null}
        onClose={() => setDeleteCourseId(null)}
        onConfirm={handleDelete}
        title="Admin: Delete Course"
        message="Permanently delete this course and all associated student enrollments and records?"
        isDestructive={true}
      />
    </div>
  );
};
