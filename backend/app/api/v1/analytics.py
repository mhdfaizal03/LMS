from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user, get_instructor_user, get_admin_user
from app.models import User
from app.schemas import StudentDashboardStats, InstructorDashboardStats, AdminDashboardStats
from app.services.analytics_service import analytics_service

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/student", response_model=StudentDashboardStats)
def get_student_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return analytics_service.get_student_dashboard_stats(db, current_user.id)


@router.get("/instructor", response_model=InstructorDashboardStats)
def get_instructor_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_instructor_user)
):
    return analytics_service.get_instructor_dashboard_stats(db, current_user.id)


@router.get("/admin", response_model=AdminDashboardStats)
def get_admin_analytics(
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    return analytics_service.get_admin_dashboard_stats(db)
