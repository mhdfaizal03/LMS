from datetime import datetime
from typing import Optional, List
from sqlalchemy.orm import Session
from app.models import (
    Assignment, AssignmentSubmission, SubmissionStatus, User, Lesson
)
from app.schemas import AssignmentCreate, AssignmentUpdate, AssignmentSubmissionCreate, AssignmentGradeRequest
from app.services.progress_service import progress_service
from app.services.notification_service import notification_service


class AssignmentService:
    @staticmethod
    def get_assignment(db: Session, assignment_id: int) -> Optional[Assignment]:
        return db.query(Assignment).filter(Assignment.id == assignment_id).first()

    @staticmethod
    def create_assignment(
        db: Session,
        course_id: int,
        data: AssignmentCreate,
        lesson_id: Optional[int] = None
    ) -> Assignment:
        assignment = Assignment(
            course_id=course_id,
            lesson_id=lesson_id,
            title=data.title,
            description=data.description,
            instructions=data.instructions,
            deadline=data.deadline,
            max_marks=data.max_marks,
            resource_url=data.resource_url
        )
        db.add(assignment)
        db.commit()
        db.refresh(assignment)
        return assignment

    @staticmethod
    def submit_assignment(
        db: Session,
        assignment_id: int,
        user_id: int,
        data: AssignmentSubmissionCreate
    ) -> AssignmentSubmission:
        assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
        if not assignment:
            raise ValueError("Assignment not found")

        # Check existing submission
        submission = (
            db.query(AssignmentSubmission)
            .filter(
                AssignmentSubmission.assignment_id == assignment_id,
                AssignmentSubmission.user_id == user_id
            )
            .first()
        )

        if not submission:
            submission = AssignmentSubmission(
                assignment_id=assignment_id,
                user_id=user_id,
                submission_text=data.submission_text,
                file_url=data.file_url,
                submitted_at=datetime.utcnow(),
                status=SubmissionStatus.SUBMITTED
            )
            db.add(submission)
        else:
            submission.submission_text = data.submission_text
            if data.file_url:
                submission.file_url = data.file_url
            submission.submitted_at = datetime.utcnow()
            submission.status = SubmissionStatus.RESUBMITTED

        db.commit()
        db.refresh(submission)

        # Notify instructor
        if assignment.lesson and assignment.lesson.section:
            instructor_id = assignment.lesson.section.course.instructor_id
            user = db.query(User).filter(User.id == user_id).first()
            user_name = user.name if user else "A student"
            notification_service.create_notification(
                db=db,
                user_id=instructor_id,
                title="New Assignment Submission",
                message=f"{user_name} submitted assignment '{assignment.title}'.",
                notification_type="assignment",
                link_url=f"/instructor/assignments"
            )

        return submission

    @staticmethod
    def grade_submission(
        db: Session,
        submission_id: int,
        instructor_id: int,
        grade_data: AssignmentGradeRequest
    ) -> AssignmentSubmission:
        submission = db.query(AssignmentSubmission).filter(AssignmentSubmission.id == submission_id).first()
        if not submission:
            raise ValueError("Submission not found")

        submission.grade = grade_data.grade
        submission.feedback = grade_data.feedback
        submission.graded_by = instructor_id
        submission.graded_at = datetime.utcnow()
        submission.status = SubmissionStatus.GRADED
        db.commit()
        db.refresh(submission)

        # If student passed (>= 50% max marks) and linked to a lesson, mark lesson completed
        assignment = submission.assignment
        if assignment and assignment.lesson_id and (submission.grade >= 0.5 * assignment.max_marks):
            progress_service.update_lesson_progress(
                db=db,
                user_id=submission.user_id,
                lesson_id=assignment.lesson_id,
                is_completed=True
            )

        # Notify student
        notification_service.create_notification(
            db=db,
            user_id=submission.user_id,
            title=f"Assignment Graded: {assignment.title if assignment else 'Assignment'}",
            message=f"You received {submission.grade}/{assignment.max_marks if assignment else 100} points. Feedback: {grade_data.feedback or 'Good job!'}",
            notification_type="grade",
            link_url=f"/learn/{assignment.course_id}?lesson={assignment.lesson_id}" if (assignment and assignment.lesson_id) else None
        )

        return submission


assignment_service = AssignmentService()
