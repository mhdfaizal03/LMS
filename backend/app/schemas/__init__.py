from datetime import datetime
from typing import Optional, List, Dict, Any, Union
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from app.models import (
    UserRole, UserStatus, CourseStatus, DifficultyLevel, LessonType, QuestionType, SubmissionStatus
)


# --- AUTH & USER SCHEMAS ---

class UserBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    role: UserRole = UserRole.STUDENT
    phone: Optional[str] = None
    bio: Optional[str] = None
    expertise: Optional[str] = None


class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: Optional[UserRole] = UserRole.STUDENT
    phone: Optional[str] = None
    bio: Optional[str] = None
    expertise: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserResponse"


class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    expertise: Optional[str] = None
    profile_image: Optional[str] = None
    status: Optional[UserStatus] = None
    role: Optional[UserRole] = None
    password: Optional[str] = None


class PasswordChange(BaseModel):
    old_password: str
    new_password: str = Field(..., min_length=6)


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: UserRole
    profile_image: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    expertise: Optional[str] = None
    status: UserStatus
    created_at: datetime
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True


# --- CATEGORY SCHEMAS ---

class CategoryBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    slug: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    is_active: bool = True
    display_order: int = 0


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    is_active: Optional[bool] = None
    display_order: Optional[int] = None


class CategoryResponse(CategoryBase):
    id: int
    slug: str
    created_at: datetime
    courses_count: Optional[int] = 0

    class Config:
        from_attributes = True


# --- LESSON & SECTION SCHEMAS ---

class LessonCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=200)
    description: Optional[str] = None
    lesson_type: LessonType = LessonType.VIDEO
    content: Optional[str] = None
    video_url: Optional[str] = None
    duration_seconds: int = 0
    pdf_url: Optional[str] = None
    resource_url: Optional[str] = None
    is_preview: bool = False
    order: int = 0


class LessonUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    lesson_type: Optional[LessonType] = None
    content: Optional[str] = None
    video_url: Optional[str] = None
    duration_seconds: Optional[int] = None
    pdf_url: Optional[str] = None
    resource_url: Optional[str] = None
    is_preview: Optional[bool] = None
    order: Optional[int] = None


class LessonResponse(BaseModel):
    id: int
    section_id: int
    title: str
    description: Optional[str] = None
    lesson_type: LessonType
    content: Optional[str] = None
    video_url: Optional[str] = None
    duration_seconds: int
    pdf_url: Optional[str] = None
    resource_url: Optional[str] = None
    is_preview: bool
    order: int
    is_completed: Optional[bool] = False
    last_position_seconds: Optional[int] = 0
    created_at: datetime

    class Config:
        from_attributes = True


class SectionCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=200)
    description: Optional[str] = None
    order: int = 0


class SectionUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    order: Optional[int] = None


class SectionResponse(BaseModel):
    id: int
    course_id: int
    title: str
    description: Optional[str] = None
    order: int
    lessons: List[LessonResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True


# --- COURSE SCHEMAS ---

class CourseBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    thumbnail: Optional[str] = None
    category_id: Optional[int] = None
    difficulty_level: DifficultyLevel = DifficultyLevel.ALL_LEVELS
    language: str = "English"
    price: float = 0.0
    is_free: bool = True
    status: CourseStatus = CourseStatus.DRAFT
    duration_minutes: int = 0
    learning_objectives: List[str] = []
    requirements: List[str] = []
    tags: List[str] = []


class CourseCreate(CourseBase):
    pass


class CourseUpdate(BaseModel):
    title: Optional[str] = None
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    thumbnail: Optional[str] = None
    category_id: Optional[int] = None
    difficulty_level: Optional[DifficultyLevel] = None
    language: Optional[str] = None
    price: Optional[float] = None
    is_free: Optional[bool] = None
    status: Optional[CourseStatus] = None
    duration_minutes: Optional[int] = None
    learning_objectives: Optional[List[str]] = None
    requirements: Optional[List[str]] = None
    tags: Optional[List[str]] = None


class CourseResponse(CourseBase):
    id: int
    slug: str
    instructor_id: int
    instructor: Optional[UserResponse] = None
    category: Optional[CategoryResponse] = None
    created_at: datetime
    updated_at: datetime
    students_count: Optional[int] = 0
    lessons_count: Optional[int] = 0
    rating: Optional[float] = 4.8
    is_enrolled: Optional[bool] = False
    progress_percentage: Optional[float] = 0.0

    class Config:
        from_attributes = True


class CourseDetailResponse(CourseResponse):
    sections: List[SectionResponse] = []

    class Config:
        from_attributes = True


# --- ENROLLMENT & PROGRESS SCHEMAS ---

class EnrollmentResponse(BaseModel):
    id: int
    user_id: int
    course_id: int
    enrolled_at: datetime
    status: str
    completed_at: Optional[datetime] = None
    progress_percentage: float
    last_accessed_at: datetime
    last_lesson_id: Optional[int] = None
    course: Optional[CourseResponse] = None

    class Config:
        from_attributes = True


class LessonProgressUpdate(BaseModel):
    is_completed: bool = False
    last_position_seconds: int = 0


class LessonProgressResponse(BaseModel):
    id: int
    user_id: int
    lesson_id: int
    course_id: int
    is_completed: bool
    last_position_seconds: int
    completed_at: Optional[datetime] = None
    updated_at: datetime

    class Config:
        from_attributes = True


class CourseProgressSummary(BaseModel):
    course_id: int
    total_lessons: int
    completed_lessons: int
    progress_percentage: float
    is_completed: bool
    certificate_id: Optional[str] = None


# --- QUIZ SCHEMAS ---

class QuestionOption(BaseModel):
    id: str
    text: str


class QuestionCreate(BaseModel):
    question_text: str
    question_type: QuestionType = QuestionType.SINGLE_CHOICE
    options: List[Dict[str, Any]] = []
    correct_answers: List[str] = []
    explanation: Optional[str] = None
    marks: float = 1.0
    order: int = 0


class QuestionUpdate(BaseModel):
    question_text: Optional[str] = None
    question_type: Optional[QuestionType] = None
    options: Optional[List[Dict[str, Any]]] = None
    correct_answers: Optional[List[str]] = None
    explanation: Optional[str] = None
    marks: Optional[float] = None
    order: Optional[int] = None


class QuestionResponse(BaseModel):
    id: int
    quiz_id: int
    question_text: str
    question_type: QuestionType
    options: List[Dict[str, Any]]
    explanation: Optional[str] = None
    marks: float
    order: int
    # Note: correct_answers are excluded for student quiz taking

    class Config:
        from_attributes = True


class QuestionDetailResponse(QuestionResponse):
    correct_answers: List[str] = []

    class Config:
        from_attributes = True


class QuizCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=200)
    description: Optional[str] = None
    instructions: Optional[str] = None
    time_limit_minutes: int = 15
    passing_score: float = 70.0
    max_attempts: int = 3
    is_randomized: bool = False
    questions: Optional[List[QuestionCreate]] = []


class QuizUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    instructions: Optional[str] = None
    time_limit_minutes: Optional[int] = None
    passing_score: Optional[float] = None
    max_attempts: Optional[int] = None
    is_randomized: Optional[bool] = None


class QuizResponse(BaseModel):
    id: int
    lesson_id: Optional[int] = None
    course_id: int
    title: str
    description: Optional[str] = None
    instructions: Optional[str] = None
    time_limit_minutes: int
    passing_score: float
    max_attempts: int
    is_randomized: bool
    questions: List[QuestionResponse] = []
    user_attempts_count: Optional[int] = 0
    best_score_percentage: Optional[float] = None
    is_passed: Optional[bool] = False

    class Config:
        from_attributes = True


class QuizAnswerSubmission(BaseModel):
    question_id: int
    user_answer: Union[str, List[str]]


class QuizSubmitRequest(BaseModel):
    answers: List[QuizAnswerSubmission]


class QuizAnswerResponse(BaseModel):
    id: int
    question_id: int
    user_answer: Optional[Any] = None
    is_correct: bool
    marks_awarded: float

    model_config = ConfigDict(from_attributes=True)


class QuizAttemptResponse(BaseModel):
    id: int
    quiz_id: int
    user_id: int
    score: float
    max_score: float
    percentage: float
    is_passed: bool
    attempt_number: int
    started_at: datetime
    completed_at: Optional[datetime] = None
    answers: List[QuizAnswerResponse] = []

    model_config = ConfigDict(from_attributes=True)


# --- ASSIGNMENT SCHEMAS ---

class AssignmentCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=200)
    description: Optional[str] = None
    instructions: Optional[str] = None
    deadline: Optional[datetime] = None
    max_marks: float = 100.0
    resource_url: Optional[str] = None


class AssignmentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    instructions: Optional[str] = None
    deadline: Optional[datetime] = None
    max_marks: Optional[float] = None
    resource_url: Optional[str] = None


class AssignmentSubmissionCreate(BaseModel):
    submission_text: Optional[str] = None
    file_url: Optional[str] = None


class AssignmentGradeRequest(BaseModel):
    grade: float
    feedback: Optional[str] = None


class AssignmentSubmissionResponse(BaseModel):
    id: int
    assignment_id: int
    user_id: int
    submission_text: Optional[str] = None
    file_url: Optional[str] = None
    submitted_at: datetime
    grade: Optional[float] = None
    feedback: Optional[str] = None
    graded_by: Optional[int] = None
    graded_at: Optional[datetime] = None
    status: SubmissionStatus
    user: Optional[UserResponse] = None

    class Config:
        from_attributes = True


class AssignmentResponse(BaseModel):
    id: int
    lesson_id: Optional[int] = None
    course_id: int
    title: str
    description: Optional[str] = None
    instructions: Optional[str] = None
    deadline: Optional[datetime] = None
    max_marks: float
    resource_url: Optional[str] = None
    created_at: datetime
    my_submission: Optional[AssignmentSubmissionResponse] = None

    class Config:
        from_attributes = True


# --- CERTIFICATE SCHEMAS ---

class CertificateResponse(BaseModel):
    id: int
    certificate_code: str
    user_id: int
    course_id: int
    issued_at: datetime
    student_name: str
    course_name: str
    instructor_name: str
    verification_url: Optional[str] = None

    class Config:
        from_attributes = True


class CertificateVerifyResponse(BaseModel):
    is_valid: bool
    certificate: Optional[CertificateResponse] = None
    message: str


# --- NOTIFICATION & ANNOUNCEMENT SCHEMAS ---

class NotificationResponse(BaseModel):
    id: int
    user_id: int
    title: str
    message: str
    notification_type: str
    link_url: Optional[str] = None
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


class AnnouncementCreate(BaseModel):
    course_id: int
    title: str = Field(..., min_length=2, max_length=200)
    content: str
    is_pinned: bool = False


class AnnouncementResponse(BaseModel):
    id: int
    course_id: int
    author_id: int
    title: str
    content: str
    is_pinned: bool
    created_at: datetime
    author: Optional[UserResponse] = None

    class Config:
        from_attributes = True


# --- AUDIT LOG SCHEMA ---

class AuditLogResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    action: str
    target_type: str
    target_id: Optional[str] = None
    details: Optional[Dict[str, Any]] = None
    ip_address: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# --- ANALYTICS SCHEMAS ---

class StudentDashboardStats(BaseModel):
    enrolled_courses_count: int
    completed_courses_count: int
    certificates_count: int
    in_progress_count: int
    average_quiz_score: float
    recent_enrollments: List[EnrollmentResponse] = []
    recent_certificates: List[CertificateResponse] = []
    unread_notifications_count: int


class InstructorDashboardStats(BaseModel):
    total_courses: int
    published_courses: int
    draft_courses: int
    total_students: int
    total_enrollments: int
    total_quizzes: int
    pending_assignments_count: int
    recent_submissions: List[AssignmentSubmissionResponse] = []
    top_courses: List[CourseResponse] = []


class AdminDashboardStats(BaseModel):
    total_users: int
    total_students: int
    total_instructors: int
    total_admins: int
    total_courses: int
    published_courses: int
    total_enrollments: int
    total_certificates: int
    recent_users: List[UserResponse] = []
    recent_audit_logs: List[AuditLogResponse] = []
