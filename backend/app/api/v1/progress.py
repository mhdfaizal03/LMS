from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models import User, Enrollment, LessonProgress
from app.schemas import (
    LessonProgressUpdate, LessonProgressResponse, CourseProgressSummary
)
from app.services.progress_service import progress_service

router = APIRouter(prefix="/progress", tags=["Progress Tracking"])


@router.post("/lesson/{lesson_id}", response_model=LessonProgressResponse)
def update_lesson_progress(
    lesson_id: int,
    data: LessonProgressUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        progress = progress_service.update_lesson_progress(
            db=db,
            user_id=current_user.id,
            lesson_id=lesson_id,
            is_completed=data.is_completed,
            last_position_seconds=data.last_position_seconds
        )
        return LessonProgressResponse.model_validate(progress)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/course/{course_id}", response_model=CourseProgressSummary)
def get_course_progress(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    summary = progress_service.get_course_progress_summary(
        db=db,
        user_id=current_user.id,
        course_id=course_id
    )
    return CourseProgressSummary(**summary)
