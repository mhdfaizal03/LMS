import apiClient from './client';
import {
  User, AuthResponse, Course, Category, Section, Lesson,
  Enrollment, Quiz, QuizAttempt, Assignment, AssignmentSubmission,
  Certificate, CertificateVerifyResult, NotificationItem, Announcement,
  AuditLogItem, StudentDashboardStats, InstructorDashboardStats, AdminDashboardStats
} from '../types';

// Auth API
export const authApi = {
  login: (data: { email: string; password: string }) =>
    apiClient.post<AuthResponse>('/auth/login', data).then((res) => res.data),
  register: (data: { name: string; email: string; password: string; role?: string }) =>
    apiClient.post<AuthResponse>('/auth/register', data).then((res) => res.data),
  getMe: () => apiClient.get<User>('/auth/me').then((res) => res.data),
  updateProfile: (data: Partial<User>) =>
    apiClient.put<User>('/auth/profile', data).then((res) => res.data),
  changePassword: (data: { old_password: string; new_password: string }) =>
    apiClient.post('/auth/change-password', data).then((res) => res.data),
};

// Course API
export const courseApi = {
  getCourses: (params?: { search?: string; category_id?: number; difficulty?: string; sort_by?: string; skip?: number; limit?: number }) =>
    apiClient.get<Course[]>('/courses', { params }).then((res) => res.data),
  getInstructorCourses: () =>
    apiClient.get<Course[]>('/courses/instructor/my-courses').then((res) => res.data),
  getCourseDetail: (idOrSlug: string | number) =>
    apiClient.get<Course>(`/courses/${idOrSlug}`).then((res) => res.data),
  createCourse: (data: Partial<Course>) =>
    apiClient.post<Course>('/courses', data).then((res) => res.data),
  updateCourse: (id: number, data: Partial<Course>) =>
    apiClient.put<Course>(`/courses/${id}`, data).then((res) => res.data),
  deleteCourse: (id: number) =>
    apiClient.delete(`/courses/${id}`).then((res) => res.data),
  getCategories: () =>
    apiClient.get<Category[]>('/categories').then((res) => res.data),
  getAllCategoriesAdmin: () =>
    apiClient.get<Category[]>('/categories/all').then((res) => res.data),
  createCategory: (data: Partial<Category>) =>
    apiClient.post<Category>('/categories', data).then((res) => res.data),
  updateCategory: (id: number, data: Partial<Category>) =>
    apiClient.put<Category>(`/categories/${id}`, data).then((res) => res.data),
  deleteCategory: (id: number) =>
    apiClient.delete(`/categories/${id}`).then((res) => res.data),
};

// Curriculum API
export const curriculumApi = {
  createSection: (courseId: number, data: { title: string; description?: string; order?: number }) =>
    apiClient.post<Section>(`/sections/course/${courseId}`, data).then((res) => res.data),
  updateSection: (sectionId: number, data: { title?: string; description?: string; order?: number }) =>
    apiClient.put<Section>(`/sections/${sectionId}`, data).then((res) => res.data),
  deleteSection: (sectionId: number) =>
    apiClient.delete(`/sections/${sectionId}`).then((res) => res.data),
  getLessonDetail: (lessonId: number) =>
    apiClient.get<Lesson>(`/lessons/${lessonId}`).then((res) => res.data),
  createLesson: (sectionId: number, data: Partial<Lesson>) =>
    apiClient.post<Lesson>(`/lessons/section/${sectionId}`, data).then((res) => res.data),
  updateLesson: (lessonId: number, data: Partial<Lesson>) =>
    apiClient.put<Lesson>(`/lessons/${lessonId}`, data).then((res) => res.data),
  deleteLesson: (lessonId: number) =>
    apiClient.delete(`/lessons/${lessonId}`).then((res) => res.data),
};

// Enrollment & Progress API
export const enrollmentApi = {
  getMyCourses: () =>
    apiClient.get<Enrollment[]>('/enrollments/my-courses').then((res) => res.data),
  enrollCourse: (courseId: number) =>
    apiClient.post<Enrollment>(`/enrollments/course/${courseId}`).then((res) => res.data),
  unenrollCourse: (courseId: number) =>
    apiClient.delete(`/enrollments/course/${courseId}`).then((res) => res.data),
  updateProgress: (lessonId: number, data: { is_completed: boolean; last_position_seconds?: number }) =>
    apiClient.post(`/progress/lesson/${lessonId}`, data).then((res) => res.data),
  getCourseProgress: (courseId: number) =>
    apiClient.get<{ course_id: number; total_lessons: number; completed_lessons: number; progress_percentage: number; is_completed: boolean; certificate_id?: string }>(`/progress/course/${courseId}`).then((res) => res.data),
};

// Quiz API
export const quizApi = {
  getQuiz: (quizId: number) =>
    apiClient.get<Quiz>(`/quizzes/${quizId}`).then((res) => res.data),
  getLessonQuiz: (lessonId: number) =>
    apiClient.get<Quiz>(`/quizzes/lesson/${lessonId}`).then((res) => res.data),
  createQuiz: (courseId: number, data: any, lessonId?: number) =>
    apiClient.post<Quiz>(`/quizzes/course/${courseId}${lessonId ? `?lesson_id=${lessonId}` : ''}`, data).then((res) => res.data),
  updateQuiz: (quizId: number, data: any) =>
    apiClient.put<Quiz>(`/quizzes/${quizId}`, data).then((res) => res.data),
  addQuestion: (quizId: number, data: any) =>
    apiClient.post(`/quizzes/${quizId}/questions`, data).then((res) => res.data),
  deleteQuestion: (questionId: number) =>
    apiClient.delete(`/quizzes/questions/${questionId}`).then((res) => res.data),
  submitQuiz: (quizId: number, answers: { question_id: number; user_answer: any }[]) =>
    apiClient.post<QuizAttempt>(`/quizzes/${quizId}/submit`, { answers }).then((res) => res.data),
  getMyAttempts: (quizId: number) =>
    apiClient.get<QuizAttempt[]>(`/quizzes/${quizId}/attempts`).then((res) => res.data),
};

// Assignment API
export const assignmentApi = {
  getAssignment: (assignmentId: number) =>
    apiClient.get<Assignment>(`/assignments/${assignmentId}`).then((res) => res.data),
  getLessonAssignment: (lessonId: number) =>
    apiClient.get<Assignment>(`/assignments/lesson/${lessonId}`).then((res) => res.data),
  createAssignment: (courseId: number, data: any, lessonId?: number) =>
    apiClient.post<Assignment>(`/assignments/course/${courseId}${lessonId ? `?lesson_id=${lessonId}` : ''}`, data).then((res) => res.data),
  submitAssignment: (assignmentId: number, data: { submission_text?: string; file_url?: string }) =>
    apiClient.post<AssignmentSubmission>(`/assignments/${assignmentId}/submit`, data).then((res) => res.data),
  listSubmissions: (assignmentId: number) =>
    apiClient.get<AssignmentSubmission[]>(`/assignments/${assignmentId}/submissions`).then((res) => res.data),
  gradeSubmission: (submissionId: number, data: { grade: number; feedback?: string }) =>
    apiClient.post<AssignmentSubmission>(`/assignments/submissions/${submissionId}/grade`, data).then((res) => res.data),
};

// Certificates API
export const certificateApi = {
  getMyCertificates: () =>
    apiClient.get<Certificate[]>('/certificates/my-certificates').then((res) => res.data),
  verifyCertificate: (code: string) =>
    apiClient.get<CertificateVerifyResult>(`/certificates/verify/${code}`).then((res) => res.data),
};

// Notifications & Announcements API
export const notificationApi = {
  getNotifications: () =>
    apiClient.get<NotificationItem[]>('/notifications').then((res) => res.data),
  markRead: (id: number) =>
    apiClient.put(`/notifications/${id}/read`).then((res) => res.data),
  markAllRead: () =>
    apiClient.put('/notifications/mark-all-read').then((res) => res.data),
  getCourseAnnouncements: (courseId: number) =>
    apiClient.get<Announcement[]>(`/announcements/course/${courseId}`).then((res) => res.data),
  createAnnouncement: (data: { course_id: number; title: string; content: string; is_pinned?: boolean }) =>
    apiClient.post<Announcement>('/announcements', data).then((res) => res.data),
};

// Analytics API
export const analyticsApi = {
  getStudentStats: () =>
    apiClient.get<StudentDashboardStats>('/analytics/student').then((res) => res.data),
  getInstructorStats: () =>
    apiClient.get<InstructorDashboardStats>('/analytics/instructor').then((res) => res.data),
  getAdminStats: () =>
    apiClient.get<AdminDashboardStats>('/analytics/admin').then((res) => res.data),
};

// Admin API
export const adminApi = {
  getUsers: (params?: { search?: string; role?: string; status_filter?: string; skip?: number; limit?: number }) =>
    apiClient.get<User[]>('/users', { params }).then((res) => res.data),
  createUser: (data: any) =>
    apiClient.post<User>('/users', data).then((res) => res.data),
  updateUser: (userId: number, data: any) =>
    apiClient.put<User>(`/users/${userId}`, data).then((res) => res.data),
  approveInstructor: (userId: number) =>
    apiClient.post<User>(`/users/${userId}/approve`).then((res) => res.data),
  rejectInstructor: (userId: number) =>
    apiClient.post<User>(`/users/${userId}/reject`).then((res) => res.data),
  changeUserStatus: (userId: number, status: string) =>
    apiClient.post<User>(`/users/${userId}/status?status_in=${status}`).then((res) => res.data),
  deleteUser: (userId: number) =>
    apiClient.delete(`/users/${userId}`).then((res) => res.data),
  getAuditLogs: (params?: { skip?: number; limit?: number; action?: string }) =>
    apiClient.get<AuditLogItem[]>('/admin/audit-logs', { params }).then((res) => res.data),
  getSystemSummary: () =>
    apiClient.get('/admin/system-summary').then((res) => res.data),
};


// File Upload API
export const uploadApi = {
  uploadFile: (file: File, subfolder: string = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('subfolder', subfolder);
    return apiClient.post<{ url: string; filename: string; content_type: string }>('/uploads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((res) => res.data);
  },
};
