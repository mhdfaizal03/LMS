from datetime import datetime, timezone
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models import (
    Enrollment, LessonProgress, Lesson, Section, Course, Certificate
)
from app.services.certificate_service import certificate_service


class ProgressService:
    @staticmethod
    def update_lesson_progress(
        db: Session,
        user_id: int,
        lesson_id: int,
        is_completed: bool,
        last_position_seconds: int = 0
    ) -> LessonProgress:
        lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
        if not lesson:
            raise ValueError("Lesson not found")

        course_id = lesson.section.course_id

        # Update or create progress
        progress = (
            db.query(LessonProgress)
            .filter(LessonProgress.user_id == user_id, LessonProgress.lesson_id == lesson_id)
            .first()
        )

        if not progress:
            progress = LessonProgress(
                user_id=user_id,
                lesson_id=lesson_id,
                course_id=course_id,
                is_completed=is_completed,
                last_position_seconds=last_position_seconds,
                completed_at=datetime.now(timezone.utc) if is_completed else None
            )
            db.add(progress)
        else:
            if is_completed and not progress.is_completed:
                progress.is_completed = True
                progress.completed_at = datetime.now(timezone.utc)
            elif not is_completed:
                progress.is_completed = False
                progress.completed_at = None
            progress.last_position_seconds = last_position_seconds
            progress.updated_at = datetime.now(timezone.utc)

        db.commit()
        db.refresh(progress)

        # Update enrollment stats
        ProgressService.recalculate_course_progress(db, user_id, course_id, last_lesson_id=lesson_id)

        return progress

    @staticmethod
    def recalculate_course_progress(
        db: Session,
        user_id: int,
        course_id: int,
        last_lesson_id: Optional[int] = None
    ) -> Enrollment:
        enrollment = (
            db.query(Enrollment)
            .filter(Enrollment.user_id == user_id, Enrollment.course_id == course_id)
            .first()
        )
        if not enrollment:
            return None

        # Total lessons in course
        all_lessons = (
            db.query(Lesson)
            .join(Section, Lesson.section_id == Section.id)
            .filter(Section.course_id == course_id)
            .all()
        )
        total_lessons = len(all_lessons)
        if total_lessons == 0:
            percentage = 100.0
        else:
            lesson_ids = [l.id for l in all_lessons]
            completed_count = (
                db.query(LessonProgress)
                .filter(
                    LessonProgress.user_id == user_id,
                    LessonProgress.lesson_id.in_(lesson_ids),
                    LessonProgress.is_completed == True
                )
                .count()
            )
            percentage = round((completed_count / total_lessons) * 100.0, 1)

        enrollment.progress_percentage = percentage
        enrollment.last_accessed_at = datetime.now(timezone.utc)
        if last_lesson_id:
            enrollment.last_lesson_id = last_lesson_id

        if percentage >= 100.0:
            enrollment.status = "completed"
            if not enrollment.completed_at:
                enrollment.completed_at = datetime.now(timezone.utc)
            # Issue certificate automatically
            certificate_service.issue_certificate(db, user_id, course_id)
        else:
            enrollment.status = "active"

        db.commit()
        db.refresh(enrollment)
        return enrollment

    @staticmethod
    def get_course_progress_summary(db: Session, user_id: int, course_id: int) -> Dict[str, Any]:
        all_lessons = (
            db.query(Lesson)
            .join(Section, Lesson.section_id == Section.id)
            .filter(Section.course_id == course_id)
            .all()
        )
        total_lessons = len(all_lessons)
        lesson_ids = [l.id for l in all_lessons]

        completed_count = 0
        if lesson_ids:
            completed_count = (
                db.query(LessonProgress)
                .filter(
                    LessonProgress.user_id == user_id,
                    LessonProgress.lesson_id.in_(lesson_ids),
                    LessonProgress.is_completed == True
                )
                .count()
            )

        percentage = round((completed_count / total_lessons * 100.0), 1) if total_lessons > 0 else 0.0
        is_completed = percentage >= 100.0

        certificate = (
            db.query(Certificate)
            .filter(Certificate.user_id == user_id, Certificate.course_id == course_id)
            .first()
        )

        return {
            "course_id": course_id,
            "total_lessons": total_lessons,
            "completed_lessons": completed_count,
            "progress_percentage": percentage,
            "is_completed": is_completed,
            "certificate_id": certificate.certificate_code if certificate else None
        }


progress_service = ProgressService()
