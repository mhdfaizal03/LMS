export type UserRole = 'student' | 'instructor' | 'admin' | 'superadmin';
export type UserStatus = 'active' | 'pending' | 'inactive' | 'suspended' | 'rejected';
export type CourseStatus = 'draft' | 'pending_review' | 'published' | 'archived';
export type DifficultyLevel = 'all_levels' | 'beginner' | 'intermediate' | 'advanced' | string;
export type LessonType = 'video' | 'audio' | 'text' | 'pdf' | 'quiz' | 'assignment' | string;
export type QuestionType = 'single_choice' | 'multiple_choice' | 'true_false' | 'short_answer';
export type SubmissionStatus = 'submitted' | 'graded' | 'resubmitted';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  profile_image?: string;
  phone?: string;
  bio?: string;
  expertise?: string;
  status: UserStatus;
  created_at: string;
  last_login?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  courses_count?: number;
}

export interface Lesson {
  id: number;
  section_id: number;
  title: string;
  description?: string;
  lesson_type: LessonType;
  content?: string;
  video_url?: string;
  duration_minutes?: number;
  duration_seconds?: number;
  pdf_url?: string;
  resource_url?: string;
  is_preview?: boolean;
  is_free_preview?: boolean;
  order?: number;
  display_order?: number;
  is_completed?: boolean;
  last_position_seconds?: number;
  created_at?: string;
}

export interface Section {
  id: number;
  course_id: number;
  title: string;
  description?: string;
  order?: number;
  display_order?: number;
  lessons: Lesson[];
  created_at?: string;
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  short_description?: string;
  description?: string;
  full_description?: string;
  thumbnail?: string;
  thumbnail_url?: string;
  category_id?: number;
  instructor_id?: number;
  instructor?: User;
  category?: Category;
  difficulty_level?: DifficultyLevel;
  language?: string;
  price?: number;
  is_free?: boolean;
  status?: CourseStatus | string;
  duration_minutes?: number;
  estimated_duration_hours?: number;
  total_students_enrolled?: number;
  students_count?: number;
  lessons_count?: number;
  rating?: number;
  is_enrolled?: boolean;
  progress_percentage?: number;
  learning_objectives?: string[];
  requirements?: string[];
  tags?: string[];
  created_at?: string;
  updated_at?: string;
  sections?: Section[];
}

export interface Enrollment {
  id: number;
  user_id: number;
  course_id: number;
  enrolled_at: string;
  status: string;
  completed_at?: string;
  progress_percentage: number;
  last_accessed_at: string;
  last_lesson_id?: number;
  course?: Course;
}

export interface QuestionOption {
  id?: string;
  text?: string;
  [key: string]: any;
}

export interface Question {
  id: number;
  quiz_id?: number;
  question_text: string;
  question_type?: QuestionType;
  options?: any;
  explanation?: string;
  marks?: number;
  order?: number;
  correct_answers?: string[];
  correct_option_index?: number;
}

export interface Quiz {
  id: number;
  lesson_id?: number;
  course_id: number;
  title: string;
  description?: string;
  instructions?: string;
  time_limit_minutes?: number;
  passing_score?: number;
  passing_score_percentage?: number;
  max_attempts?: number;
  is_randomized?: boolean;
  questions: Question[];
  user_attempts_count?: number;
  best_score_percentage?: number;
  is_passed?: boolean;
}

export interface QuizAnswerRecord {
  id: number;
  question_id: number;
  user_answer?: any;
  is_correct: boolean;
  marks_awarded: number;
}

export interface QuizAttempt {
  id: number;
  quiz_id: number;
  user_id: number;
  score?: number;
  max_score?: number;
  percentage?: number;
  score_percentage?: number;
  is_passed: boolean;
  attempt_number: number;
  started_at: string;
  completed_at?: string;
  answers?: QuizAnswerRecord[];
}

export interface AssignmentSubmission {
  id: number;
  assignment_id: number;
  user_id: number;
  submission_text?: string;
  file_url?: string;
  submitted_at: string;
  grade?: number;
  feedback?: string;
  graded_by?: number;
  graded_at?: string;
  status: SubmissionStatus;
  user?: User;
}

export interface Assignment {
  id: number;
  lesson_id?: number;
  course_id: number;
  title: string;
  description?: string;
  instructions?: string;
  deadline?: string;
  max_marks: number;
  resource_url?: string;
  created_at?: string;
  my_submission?: AssignmentSubmission;
}

export interface Certificate {
  id: number;
  certificate_code: string;
  user_id: number;
  course_id: number;
  issued_at: string;
  student_name: string;
  course_name: string;
  instructor_name: string;
  verification_url?: string;
  course?: Course;
}

export interface CertificateVerifyResult {
  is_valid?: boolean;
  valid?: boolean;
  certificate?: Certificate;
  message?: string;
  recipient_name?: string;
  course_title?: string;
  issue_date?: string;
}

export interface NotificationItem {
  id: number;
  user_id: number;
  title: string;
  message: string;
  notification_type: string;
  link_url?: string;
  is_read: boolean;
  created_at: string;
}

export interface Announcement {
  id: number;
  course_id: number;
  author_id: number;
  title: string;
  content: string;
  is_pinned: boolean;
  created_at: string;
  author?: User;
}

export interface AuditLogItem {
  id: number;
  user_id?: number;
  action: string;
  target_type: string;
  target_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  created_at: string;
}

export interface StudentDashboardStats {
  enrolled_courses_count?: number;
  completed_courses_count?: number;
  certificates_count?: number;
  certificates_earned?: number;
  total_hours_spent?: number;
  in_progress_count?: number;
  average_quiz_score?: number;
  recent_enrollments?: Enrollment[];
  recent_certificates?: Certificate[];
  unread_notifications_count?: number;
}

export interface InstructorDashboardStats {
  total_courses?: number;
  published_courses?: number;
  draft_courses?: number;
  total_students?: number;
  total_enrollments?: number;
  total_quizzes?: number;
  average_rating?: number;
  pending_grading?: number;
  pending_assignments_count?: number;
  recent_submissions?: AssignmentSubmission[];
  top_courses?: Course[];
}

export interface AdminDashboardStats {
  total_users?: number;
  total_students?: number;
  total_instructors?: number;
  total_admins?: number;
  total_courses?: number;
  published_courses?: number;
  total_enrollments?: number;
  total_certificates?: number;
  total_certificates_issued?: number;
  recent_users?: User[];
  recent_audit_logs?: AuditLogItem[];
}
