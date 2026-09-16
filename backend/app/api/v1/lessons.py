from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user, get_optional_current_user, get_instructor_user
from app.models import (
    Lesson, Section, Course, Enrollment, LessonProgress, User, UserRole, LessonType
)
from app.schemas import LessonCreate, LessonUpdate, LessonResponse

router = APIRouter(prefix="/lessons", tags=["Lessons"])


@router.get("/{lesson_id}", response_model=LessonResponse)
def get_lesson_detail(
    lesson_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    course = lesson.section.course

    # Check access permission: is preview, or enrolled student, or course instructor, or admin
    has_access = False
    if lesson.is_preview:
        has_access = True
    elif current_user:
        if current_user.role in [UserRole.ADMIN, UserRole.SUPERADMIN] or current_user.id == course.instructor_id:
            has_access = True
        else:
            enrollment = db.query(Enrollment).filter(
                Enrollment.user_id == current_user.id,
                Enrollment.course_id == course.id
            ).first()
            if enrollment:
                has_access = True

    if not has_access:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You must be enrolled in this course to access this lesson."
        )

    resp = LessonResponse.model_validate(lesson)

    # Attach student progress if logged in
    if current_user:
        prog = db.query(LessonProgress).filter(
            LessonProgress.user_id == current_user.id,
            LessonProgress.lesson_id == lesson.id
        ).first()
        if prog:
            resp.is_completed = prog.is_completed
            resp.last_position_seconds = prog.last_position_seconds

    return resp


@router.post("/section/{section_id}", response_model=LessonResponse, status_code=status.HTTP_201_CREATED)
def create_lesson(
    section_id: int,
    lesson_in: LessonCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_instructor_user)
):
    section = db.query(Section).filter(Section.id == section_id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")

    if current_user.role not in [UserRole.ADMIN, UserRole.SUPERADMIN] and section.course.instructor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this course")

    max_order = db.query(Lesson).filter(Lesson.section_id == section_id).count()

    dur = lesson_in.duration_seconds or 0
    if lesson_in.duration_minutes is not None and lesson_in.duration_minutes > 0:
        dur = lesson_in.duration_minutes * 60

    lesson = Lesson(
        section_id=section_id,
        title=lesson_in.title,
        description=lesson_in.description,
        lesson_type=lesson_in.lesson_type,
        content=lesson_in.content,
        video_url=lesson_in.video_url,
        duration_seconds=dur,
        pdf_url=lesson_in.pdf_url,
        resource_url=lesson_in.resource_url,
        is_preview=lesson_in.is_preview,
        order=lesson_in.order if lesson_in.order > 0 else max_order
    )
    db.add(lesson)
    db.commit()
    db.refresh(lesson)
    return LessonResponse.model_validate(lesson)



@router.put("/{lesson_id}", response_model=LessonResponse)
def update_lesson(
    lesson_id: int,
    lesson_update: LessonUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_instructor_user)
):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    if current_user.role not in [UserRole.ADMIN, UserRole.SUPERADMIN] and lesson.section.course.instructor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this lesson")

    for field, val in lesson_update.model_dump(exclude_unset=True).items():
        setattr(lesson, field, val)

    db.commit()
    db.refresh(lesson)
    return LessonResponse.model_validate(lesson)


@router.delete("/{lesson_id}")
def delete_lesson(
    lesson_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_instructor_user)
):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    if current_user.role not in [UserRole.ADMIN, UserRole.SUPERADMIN] and lesson.section.course.instructor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this lesson")

    db.delete(lesson)
    db.commit()
    return {"message": "Lesson deleted successfully"}
