import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/auth/LoginPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import AdminCourses from './pages/admin/Courses'
import AdminEnrollments from './pages/admin/Enrollments'
import AdminReports from './pages/admin/Reports'
import AdminSettings from './pages/admin/Settings'
import InstructorLayout from './layouts/InstructorLayout'
import InstructorDashboard from './pages/instructor/Dashboard'
import InstructorCourses from './pages/instructor/Courses'
import CourseBuilder from './pages/instructor/CourseBuilder'
import InstructorStudents from './pages/instructor/Students'
import InstructorGrading from './pages/instructor/Grading'
import InstructorAnalytics from './pages/instructor/Analytics'
import StudentLayout from './layouts/StudentLayout'
import StudentDashboard from './pages/student/Dashboard'
import BrowseCourses from './pages/student/BrowseCourses'
import CourseDetail from './pages/student/CourseDetail'
import LearningPage from './pages/student/LearningPage'
import QuizPage from './pages/student/QuizPage'
import StudentCertificates from './pages/student/Certificates'
import StudentProfile from './pages/student/Profile'
import NotFoundPage from './pages/shared/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="enrollments" element={<AdminEnrollments />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="/instructor" element={<InstructorLayout />}>
          <Route index element={<InstructorDashboard />} />
          <Route path="courses" element={<InstructorCourses />} />
          <Route path="courses/builder" element={<CourseBuilder />} />
          <Route path="students" element={<InstructorStudents />} />
          <Route path="grading" element={<InstructorGrading />} />
          <Route path="analytics" element={<InstructorAnalytics />} />
        </Route>

        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="courses" element={<BrowseCourses />} />
          <Route path="courses/:id" element={<CourseDetail />} />
          <Route path="learn/:id" element={<LearningPage />} />
          <Route path="quiz/:id" element={<QuizPage />} />
          <Route path="certificates" element={<StudentCertificates />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
