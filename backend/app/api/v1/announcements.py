from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user, get_instructor_user
from app.models import Announcement, Course, User, UserRole, Enrollment
from app.schemas import AnnouncementCreate, AnnouncementResponse
from app.services.notification_service import notification_service

router = APIRouter(prefix="/announcements", tags=["Announcements"])


@router.get("/course/{course_id}", response_model=List[AnnouncementResponse])
def get_course_announcements(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    announcements = (
        db.query(Announcement)
        .filter(Announcement.course_id == course_id)
        .order_by(Announcement.is_pinned.desc(), Announcement.created_at.desc())
        .all()
    )
    return [AnnouncementResponse.model_validate(a) for a in announcements]


@router.post("", response_model=AnnouncementResponse, status_code=status.HTTP_201_CREATED)
def create_announcement(
    data: AnnouncementCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_instructor_user)
):
    course = db.query(Course).filter(Course.id == data.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    if current_user.role not in [UserRole.ADMIN, UserRole.SUPERADMIN] and course.instructor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to post announcements for this course")

    announcement = Announcement(
        course_id=data.course_id,
        author_id=current_user.id,
        title=data.title,
        content=data.content,
        is_pinned=data.is_pinned
    )
    db.add(announcement)
    db.commit()
    db.refresh(announcement)

    # Broadcast notification to enrolled students
    enrollments = db.query(Enrollment).filter(Enrollment.course_id == data.course_id).all()
    for e in enrollments:
        notification_service.create_notification(
            db=db,
            user_id=e.user_id,
            title=f"New Announcement: {course.title}",
            message=data.title,
            notification_type="announcement",
            link_url=f"/learn/{course.id}"
        )

    return AnnouncementResponse.model_validate(announcement)
