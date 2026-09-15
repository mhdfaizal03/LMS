from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models import (
    User, UserRole, Course, CourseStatus, Enrollment, Certificate,
    QuizAttempt, AssignmentSubmission, SubmissionStatus, AuditLog, Notification
)
from app.schemas import (
    StudentDashboardStats, InstructorDashboardStats, AdminDashboardStats,
    EnrollmentResponse, CertificateResponse, AssignmentSubmissionResponse, CourseResponse, UserResponse, AuditLogResponse
)


class AnalyticsService:
    @staticmethod
    def get_student_dashboard_stats(db: Session, user_id: int) -> StudentDashboardStats:
        enrollments = db.query(Enrollment).filter(Enrollment.user_id == user_id).all()
        enrolled_count = len(enrollments)
        completed_count = sum(1 for e in enrollments if e.progress_percentage >= 100.0 or e.status == "completed")
        in_progress_count = enrolled_count - completed_count

        certificates = db.query(Certificate).filter(Certificate.user_id == user_id).all()
        cert_count = len(certificates)

        # Average quiz score
        avg_score = db.query(func.avg(QuizAttempt.percentage)).filter(QuizAttempt.user_id == user_id).scalar() or 0.0

        # Unread notifications
        unread_notifs = db.query(Notification).filter(Notification.user_id == user_id, Notification.is_read == False).count()

        # Recent enrollments
        recent_enrollments = (
            db.query(Enrollment)
            .filter(Enrollment.user_id == user_id)
            .order_by(Enrollment.last_accessed_at.desc())
            .limit(5)
            .all()
        )

        return StudentDashboardStats(
            enrolled_courses_count=enrolled_count,
            completed_courses_count=completed_count,
            certificates_count=cert_count,
            in_progress_count=in_progress_count,
            average_quiz_score=round(avg_score, 1),
            recent_enrollments=[EnrollmentResponse.model_validate(e) for e in recent_enrollments],
            recent_certificates=[CertificateResponse.model_validate(c) for c in certificates[:5]],
            unread_notifications_count=unread_notifs
        )

    @staticmethod
    def get_instructor_dashboard_stats(db: Session, instructor_id: int) -> InstructorDashboardStats:
        courses = db.query(Course).filter(Course.instructor_id == instructor_id).all()
        total_courses = len(courses)
        published_courses = sum(1 for c in courses if c.status == CourseStatus.PUBLISHED)
        draft_courses = sum(1 for c in courses if c.status == CourseStatus.DRAFT)

        course_ids = [c.id for c in courses]
        total_enrollments = 0
        total_students = 0
        pending_assignments = 0
        recent_submissions = []

        if course_ids:
            total_enrollments = db.query(Enrollment).filter(Enrollment.course_id.in_(course_ids)).count()
            total_students = db.query(Enrollment.user_id).filter(Enrollment.course_id.in_(course_ids)).distinct().count()
            
            # Pending assignment submissions
            pending_query = (
                db.query(AssignmentSubmission)
                .join(AssignmentSubmission.assignment)
                .filter(
                    AssignmentSubmission.assignment.has(Course.instructor_id == instructor_id),
                    AssignmentSubmission.status.in_([SubmissionStatus.SUBMITTED, SubmissionStatus.RESUBMITTED])
                )
            )
            pending_assignments = pending_query.count()
            recent_submissions = (
                db.query(AssignmentSubmission)
                .join(AssignmentSubmission.assignment)
                .filter(AssignmentSubmission.assignment.has(Course.instructor_id == instructor_id))
                .order_by(AssignmentSubmission.submitted_at.desc())
                .limit(5)
                .all()
            )

        return InstructorDashboardStats(
            total_courses=total_courses,
            published_courses=published_courses,
            draft_courses=draft_courses,
            total_students=total_students,
            total_enrollments=total_enrollments,
            total_quizzes=0,
            pending_assignments_count=pending_assignments,
            recent_submissions=[AssignmentSubmissionResponse.model_validate(s) for s in recent_submissions],
            top_courses=[CourseResponse.model_validate(c) for c in courses[:5]]
        )

    @staticmethod
    def get_admin_dashboard_stats(db: Session) -> AdminDashboardStats:
        total_users = db.query(User).count()
        total_students = db.query(User).filter(User.role == UserRole.STUDENT).count()
        total_instructors = db.query(User).filter(User.role == UserRole.INSTRUCTOR).count()
        total_admins = db.query(User).filter(User.role.in_([UserRole.ADMIN, UserRole.SUPERADMIN])).count()

        total_courses = db.query(Course).count()
        published_courses = db.query(Course).filter(Course.status == CourseStatus.PUBLISHED).count()
        total_enrollments = db.query(Enrollment).count()
        total_certificates = db.query(Certificate).count()

        recent_users = db.query(User).order_by(User.created_at.desc()).limit(5).all()
        recent_audit_logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(10).all()

        return AdminDashboardStats(
            total_users=total_users,
            total_students=total_students,
            total_instructors=total_instructors,
            total_admins=total_admins,
            total_courses=total_courses,
            published_courses=published_courses,
            total_enrollments=total_enrollments,
            total_certificates=total_certificates,
            recent_users=[UserResponse.model_validate(u) for u in recent_users],
            recent_audit_logs=[AuditLogResponse.model_validate(l) for l in recent_audit_logs]
        )


analytics_service = AnalyticsService()
