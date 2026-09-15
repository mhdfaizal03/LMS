from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models import User, Course, Enrollment, Certificate, Notification, LessonProgress
from app.schemas import (
    UserResponse, UserUpdate, CourseResponse, EnrollmentResponse,
    CertificateResponse, NotificationResponse, StudentDashboardStats
)
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/student", tags=["Student Role API"])


@router.get("/dashboard", response_model=StudentDashboardStats)
def get_student_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve comprehensive dashboard stats for the authenticated student."""
    return AnalyticsService.get_student_dashboard(db, current_user.id)


@router.get("/profile", response_model=UserResponse)
def get_student_profile(current_user: User = Depends(get_current_user)):
    """Retrieve authenticated student's profile."""
    return UserResponse.model_validate(current_user)


@router.put("/profile", response_model=UserResponse)
def update_student_profile(
    profile_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update authenticated student's profile."""
    update_dict = profile_data.model_dump(exclude_unset=True)
    for field, val in update_dict.items():
        if hasattr(current_user, field) and val is not None:
            setattr(current_user, field, val)
    db.commit()
    db.refresh(current_user)
    return UserResponse.model_validate(current_user)


@router.get("/courses", response_model=List[EnrollmentResponse])
def get_student_courses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve all courses enrolled by the authenticated student."""
    enrollments = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id
    ).order_by(Enrollment.last_accessed_at.desc()).all()
    return [EnrollmentResponse.model_validate(e) for e in enrollments]


@router.get("/certificates", response_model=List[CertificateResponse])
def get_student_certificates(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve all certificates earned by the authenticated student."""
    certificates = db.query(Certificate).filter(
        Certificate.user_id == current_user.id
    ).order_by(Certificate.issued_at.desc()).all()
    return [CertificateResponse.model_validate(c) for c in certificates]


@router.get("/notifications", response_model=List[NotificationResponse])
def get_student_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve notifications for the authenticated student."""
    notifications = db.query(Notification).filter(
        Notification.user_id == current_user.id
    ).order_by(Notification.created_at.desc()).limit(50).all()
    return [NotificationResponse.model_validate(n) for n in notifications]
