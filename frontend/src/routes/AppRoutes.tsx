import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Auth Pages
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));

// Admin Layout & Pages
const AdminLayout = lazy(() => import('../layouts/AdminLayout'));
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const AdminUsers = lazy(() => import('../pages/admin/Users'));
const AdminCourses = lazy(() => import('../pages/admin/Courses'));
const AdminEnrollments = lazy(() => import('../pages/admin/Enrollments'));
const AdminReports = lazy(() => import('../pages/admin/Reports'));
const AdminSettings = lazy(() => import('../pages/admin/Settings'));

// Instructor Layout & Pages
const InstructorLayout = lazy(() => import('../layouts/InstructorLayout'));
const InstructorDashboard = lazy(() => import('../pages/instructor/Dashboard'));
const InstructorCourses = lazy(() => import('../pages/instructor/Courses'));
const CourseBuilder = lazy(() => import('../pages/instructor/CourseBuilder'));
const InstructorStudents = lazy(() => import('../pages/instructor/Students'));
const InstructorGrading = lazy(() => import('../pages/instructor/Grading'));
const InstructorAnalytics = lazy(() => import('../pages/instructor/Analytics'));

// Student Layout & Pages
const StudentLayout = lazy(() => import('../layouts/StudentLayout'));
const StudentDashboard = lazy(() => import('../pages/student/Dashboard'));
const BrowseCourses = lazy(() => import('../pages/student/BrowseCourses'));
const CourseDetail = lazy(() => import('../pages/student/CourseDetail'));
const LearningPage = lazy(() => import('../pages/student/LearningPage'));
const QuizPage = lazy(() => import('../pages/student/QuizPage'));
const StudentCertificates = lazy(() => import('../pages/student/Certificates'));
const StudentProfile = lazy(() => import('../pages/student/Profile'));

// Shared
const NotFoundPage = lazy(() => import('../pages/shared/NotFoundPage'));

export const AppRoutes: React.FC = () => {
  const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3 animate-fade-in">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        </div>
      </div>
    </div>
  );

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Root & Auth */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Admin Application */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="enrollments" element={<AdminEnrollments />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="certificates" element={<StudentCertificates />} />
          <Route path="analytics" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Canonical LMS Admin Alias */}
        <Route path="/lms/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="enrollments" element={<AdminEnrollments />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="certificates" element={<StudentCertificates />} />
          <Route path="analytics" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Instructor Application */}
        <Route path="/instructor" element={<InstructorLayout />}>
          <Route index element={<InstructorDashboard />} />
          <Route path="dashboard" element={<InstructorDashboard />} />
          <Route path="courses" element={<InstructorCourses />} />
          <Route path="courses/builder" element={<CourseBuilder />} />
          <Route path="courses/new" element={<CourseBuilder />} />
          <Route path="courses/:id/edit" element={<CourseBuilder />} />
          <Route path="students" element={<InstructorStudents />} />
          <Route path="grading" element={<InstructorGrading />} />
          <Route path="analytics" element={<InstructorAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Student Application */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="courses" element={<BrowseCourses />} />
          <Route path="courses/:id" element={<CourseDetail />} />
          <Route path="learn/:id" element={<LearningPage />} />
          <Route path="quiz/:id" element={<QuizPage />} />
          <Route path="certificates" element={<StudentCertificates />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>

        {/* Top-level Learning & Quiz views */}
        <Route path="/learn/:id" element={<LearningPage />} />
        <Route path="/quiz/:id" element={<QuizPage />} />

        {/* Catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

