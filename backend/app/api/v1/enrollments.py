from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models import Course, Enrollment, User, CourseStatus, Lesson
from app.schemas import EnrollmentResponse
from app.services.notification_service import notification_service

router = APIRouter(prefix="/enrollments", tags=["Enrollments"])


@router.get("/my-courses", response_model=List[EnrollmentResponse])
def get_my_enrolled_courses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    enrollments = (
        db.query(Enrollment)
        .filter(Enrollment.user_id == current_user.id)
        .order_by(Enrollment.last_accessed_at.desc())
        .all()
    )
    return [EnrollmentResponse.model_validate(e) for e in enrollments]


@router.post("/course/{course_id}", response_model=EnrollmentResponse, status_code=status.HTTP_201_CREATED)
def enroll_in_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    if course.status != CourseStatus.PUBLISHED:
        raise HTTPException(status_code=400, detail="Cannot enroll in an unpublished course.")

    # Check if already enrolled
    existing = (
        db.query(Enrollment)
        .filter(Enrollment.user_id == current_user.id, Enrollment.course_id == course_id)
        .first()
    )
    if existing:
        return EnrollmentResponse.model_validate(existing)

    # First lesson as starting point
    first_lesson = None
    if course.sections and course.sections[0].lessons:
        first_lesson = course.sections[0].lessons[0].id

    enrollment = Enrollment(
        user_id=current_user.id,
        course_id=course_id,
        status="active",
        progress_percentage=0.0,
        enrolled_at=datetime.utcnow(),
        last_accessed_at=datetime.utcnow(),
        last_lesson_id=first_lesson
    )
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)

    # Send welcome notification
    notification_service.create_notification(
        db=db,
        user_id=current_user.id,
        title="Enrolled in Course!",
        message=f"Welcome to '{course.title}'! You can start learning anytime.",
        notification_type="enrollment",
        link_url=f"/learn/{course.id}"
    )

    return EnrollmentResponse.model_validate(enrollment)


@router.delete("/course/{course_id}")
def unenroll_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    enrollment = (
        db.query(Enrollment)
        .filter(Enrollment.user_id == current_user.id, Enrollment.course_id == course_id)
        .first()
    )
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")

    db.delete(enrollment)
    db.commit()
    return {"message": "Successfully unenrolled from course"}
