import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';

// Admin Layout & Pages
import AdminLayout from '../layouts/AdminLayout';
import AdminDashboard from '../pages/admin/Dashboard';
import AdminUsers from '../pages/admin/Users';
import AdminCourses from '../pages/admin/Courses';
import AdminEnrollments from '../pages/admin/Enrollments';
import AdminReports from '../pages/admin/Reports';
import AdminSettings from '../pages/admin/Settings';

// Instructor Layout & Pages
import InstructorLayout from '../layouts/InstructorLayout';
import InstructorDashboard from '../pages/instructor/Dashboard';
import InstructorCourses from '../pages/instructor/Courses';
import CourseBuilder from '../pages/instructor/CourseBuilder';
import InstructorStudents from '../pages/instructor/Students';
import InstructorGrading from '../pages/instructor/Grading';
import InstructorAnalytics from '../pages/instructor/Analytics';

// Student Layout & Pages
import StudentLayout from '../layouts/StudentLayout';
import StudentDashboard from '../pages/student/Dashboard';
import BrowseCourses from '../pages/student/BrowseCourses';
import CourseDetail from '../pages/student/CourseDetail';
import LearningPage from '../pages/student/LearningPage';
import QuizPage from '../pages/student/QuizPage';
import StudentCertificates from '../pages/student/Certificates';
import StudentProfile from '../pages/student/Profile';

// Shared
import NotFoundPage from '../pages/shared/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
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
  );
};

