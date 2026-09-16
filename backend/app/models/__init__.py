import enum
from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, Float, DateTime, ForeignKey, Enum as SQLEnum, JSON, Index
)
from sqlalchemy.orm import relationship
from app.core.database import Base


def utc_now():
    return datetime.now(timezone.utc)


class UserRole(str, enum.Enum):
    STUDENT = "student"
    INSTRUCTOR = "instructor"
    ADMIN = "admin"
    SUPERADMIN = "superadmin"


class UserStatus(str, enum.Enum):
    ACTIVE = "active"
    PENDING = "pending"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"
    REJECTED = "rejected"



class CourseStatus(str, enum.Enum):
    DRAFT = "draft"
    PENDING_REVIEW = "pending_review"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class DifficultyLevel(str, enum.Enum):
    ALL_LEVELS = "all_levels"
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class LessonType(str, enum.Enum):
    VIDEO = "video"
    TEXT = "text"
    PDF = "pdf"
    QUIZ = "quiz"
    ASSIGNMENT = "assignment"


class QuestionType(str, enum.Enum):
    SINGLE_CHOICE = "single_choice"
    MULTIPLE_CHOICE = "multiple_choice"
    TRUE_FALSE = "true_false"
    SHORT_ANSWER = "short_answer"


class SubmissionStatus(str, enum.Enum):
    SUBMITTED = "submitted"
    GRADED = "graded"
    RESUBMITTED = "resubmitted"


# --- MODELS ---

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(180), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(SQLEnum(UserRole), default=UserRole.STUDENT, nullable=False, index=True)
    profile_image = Column(String(500), nullable=True)
    phone = Column(String(30), nullable=True)
    bio = Column(Text, nullable=True)
    expertise = Column(String(255), nullable=True)
    status = Column(SQLEnum(UserStatus), default=UserStatus.ACTIVE, nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)
    last_login = Column(DateTime, nullable=True)

    # Relationships
    courses_taught = relationship("Course", back_populates="instructor", cascade="all, delete-orphan")
    enrollments = relationship("Enrollment", back_populates="user", cascade="all, delete-orphan")
    lesson_progresses = relationship("LessonProgress", back_populates="user", cascade="all, delete-orphan")
    quiz_attempts = relationship("QuizAttempt", back_populates="user", cascade="all, delete-orphan")
    submissions = relationship("AssignmentSubmission", foreign_keys="AssignmentSubmission.user_id", back_populates="user", cascade="all, delete-orphan")
    certificates = relationship("Certificate", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    announcements = relationship("Announcement", back_populates="author", cascade="all, delete-orphan")


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(120), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    display_order = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    courses = relationship("Course", back_populates="category")


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(280), unique=True, index=True, nullable=False)
    short_description = Column(String(500), nullable=True)
    full_description = Column(Text, nullable=True)
    thumbnail = Column(String(500), nullable=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    instructor_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    difficulty_level = Column(SQLEnum(DifficultyLevel), default=DifficultyLevel.ALL_LEVELS, nullable=False)
    language = Column(String(50), default="English", nullable=False)
    price = Column(Float, default=0.0, nullable=False)
    is_free = Column(Boolean, default=True, nullable=False)
    status = Column(SQLEnum(CourseStatus), default=CourseStatus.DRAFT, nullable=False, index=True)
    duration_minutes = Column(Integer, default=0, nullable=False)
    learning_objectives = Column(JSON, default=list, nullable=False)  # List of strings
    requirements = Column(JSON, default=list, nullable=False)         # List of strings
    tags = Column(JSON, default=list, nullable=False)                 # List of strings
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    # Relationships
    instructor = relationship("User", back_populates="courses_taught")
    category = relationship("Category", back_populates="courses")
    sections = relationship("Section", back_populates="course", order_by="Section.order", cascade="all, delete-orphan")
    enrollments = relationship("Enrollment", back_populates="course", cascade="all, delete-orphan")
    certificates = relationship("Certificate", back_populates="course", cascade="all, delete-orphan")
    announcements = relationship("Announcement", back_populates="course", cascade="all, delete-orphan")


class Section(Base):
    __tablename__ = "sections"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    order = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    course = relationship("Course", back_populates="sections")
    lessons = relationship("Lesson", back_populates="section", order_by="Lesson.order", cascade="all, delete-orphan")


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    section_id = Column(Integer, ForeignKey("sections.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    lesson_type = Column(SQLEnum(LessonType), default=LessonType.VIDEO, nullable=False)
    content = Column(Text, nullable=True)
    video_url = Column(String(500), nullable=True)
    duration_seconds = Column(Integer, default=0, nullable=False)
    pdf_url = Column(String(500), nullable=True)
    resource_url = Column(String(500), nullable=True)
    is_preview = Column(Boolean, default=False, nullable=False)
    order = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    section = relationship("Section", back_populates="lessons")
    progress_records = relationship("LessonProgress", back_populates="lesson", cascade="all, delete-orphan")
    quiz = relationship("Quiz", back_populates="lesson", uselist=False, cascade="all, delete-orphan")
    assignment = relationship("Assignment", back_populates="lesson", uselist=False, cascade="all, delete-orphan")


class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    enrolled_at = Column(DateTime, default=utc_now, nullable=False)
    status = Column(String(50), default="active", nullable=False)  # active, completed, dropped
    completed_at = Column(DateTime, nullable=True)
    progress_percentage = Column(Float, default=0.0, nullable=False)
    last_accessed_at = Column(DateTime, default=utc_now, nullable=False)
    last_lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="SET NULL"), nullable=True)

    __table_args__ = (
        Index("idx_user_course_enrollment", "user_id", "course_id", unique=True),
    )

    user = relationship("User", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")
    last_lesson = relationship("Lesson")


class LessonProgress(Base):
    __tablename__ = "lesson_progresses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    is_completed = Column(Boolean, default=False, nullable=False)
    last_position_seconds = Column(Integer, default=0, nullable=False)
    completed_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    __table_args__ = (
        Index("idx_user_lesson_progress", "user_id", "lesson_id", unique=True),
    )

    user = relationship("User", back_populates="lesson_progresses")
    lesson = relationship("Lesson", back_populates="progress_records")


class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), unique=True, nullable=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    instructions = Column(Text, nullable=True)
    time_limit_minutes = Column(Integer, default=15, nullable=False)
    passing_score = Column(Float, default=70.0, nullable=False)  # In percentage
    max_attempts = Column(Integer, default=3, nullable=False)
    is_randomized = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    lesson = relationship("Lesson", back_populates="quiz")
    questions = relationship("Question", back_populates="quiz", order_by="Question.order", cascade="all, delete-orphan")
    attempts = relationship("QuizAttempt", back_populates="quiz", cascade="all, delete-orphan")


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    question_text = Column(Text, nullable=False)
    question_type = Column(SQLEnum(QuestionType), default=QuestionType.SINGLE_CHOICE, nullable=False)
    options = Column(JSON, default=list, nullable=False)          # e.g. [{"id": "a", "text": "Option A"}, ...]
    correct_answers = Column(JSON, default=list, nullable=False)  # e.g. ["a"] or ["a", "c"]
    explanation = Column(Text, nullable=True)
    marks = Column(Float, default=1.0, nullable=False)
    order = Column(Integer, default=0, nullable=False)

    quiz = relationship("Quiz", back_populates="questions")


class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    score = Column(Float, default=0.0, nullable=False)
    max_score = Column(Float, default=0.0, nullable=False)
    percentage = Column(Float, default=0.0, nullable=False)
    is_passed = Column(Boolean, default=False, nullable=False)
    attempt_number = Column(Integer, default=1, nullable=False)
    started_at = Column(DateTime, default=utc_now, nullable=False)
    completed_at = Column(DateTime, nullable=True)

    quiz = relationship("Quiz", back_populates="attempts")
    user = relationship("User", back_populates="quiz_attempts")
    answers = relationship("QuizAnswer", back_populates="attempt", cascade="all, delete-orphan")


class QuizAnswer(Base):
    __tablename__ = "quiz_answers"

    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("quiz_attempts.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    user_answer = Column(JSON, nullable=True)  # List or string depending on question type
    is_correct = Column(Boolean, default=False, nullable=False)
    marks_awarded = Column(Float, default=0.0, nullable=False)

    attempt = relationship("QuizAttempt", back_populates="answers")
    question = relationship("Question")


class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), unique=True, nullable=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    instructions = Column(Text, nullable=True)
    deadline = Column(DateTime, nullable=True)
    max_marks = Column(Float, default=100.0, nullable=False)
    resource_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    lesson = relationship("Lesson", back_populates="assignment")
    submissions = relationship("AssignmentSubmission", back_populates="assignment", cascade="all, delete-orphan")


class AssignmentSubmission(Base):
    __tablename__ = "assignment_submissions"

    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(Integer, ForeignKey("assignments.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    submission_text = Column(Text, nullable=True)
    file_url = Column(String(500), nullable=True)
    submitted_at = Column(DateTime, default=utc_now, nullable=False)
    grade = Column(Float, nullable=True)
    feedback = Column(Text, nullable=True)
    graded_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    graded_at = Column(DateTime, nullable=True)
    status = Column(SQLEnum(SubmissionStatus), default=SubmissionStatus.SUBMITTED, nullable=False)

    assignment = relationship("Assignment", back_populates="submissions")
    user = relationship("User", foreign_keys=[user_id], back_populates="submissions")
    grader = relationship("User", foreign_keys=[graded_by])


class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    certificate_code = Column(String(64), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    issued_at = Column(DateTime, default=utc_now, nullable=False)
    student_name = Column(String(150), nullable=False)
    course_name = Column(String(255), nullable=False)
    instructor_name = Column(String(150), nullable=False)
    verification_url = Column(String(500), nullable=True)

    __table_args__ = (
        Index("idx_user_course_certificate", "user_id", "course_id", unique=True),
    )

    user = relationship("User", back_populates="certificates")
    course = relationship("Course", back_populates="certificates")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(50), default="info", nullable=False)
    link_url = Column(String(500), nullable=True)
    is_read = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    user = relationship("User", back_populates="notifications")


class Announcement(Base):
    __tablename__ = "announcements"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    author_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    is_pinned = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    course = relationship("Course", back_populates="announcements")
    author = relationship("User", back_populates="announcements")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    action = Column(String(100), nullable=False)
    target_type = Column(String(50), nullable=False)
    target_id = Column(String(50), nullable=True)
    details = Column(JSON, nullable=True)
    ip_address = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)
