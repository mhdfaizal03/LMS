from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_admin_user
from app.models import User, AuditLog, Course, Enrollment, Certificate, Category, UserRole
from app.schemas import (
    AuditLogResponse, AdminDashboardStats, UserResponse, CourseResponse, CategoryResponse
)
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/admin", tags=["Admin Portal"])


@router.get("/dashboard", response_model=AdminDashboardStats)
def get_admin_dashboard(
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    """Retrieve comprehensive system statistics and KPI metrics for admin."""
    return AnalyticsService.get_admin_dashboard(db)


@router.get("/users", response_model=List[UserResponse])
def get_admin_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    search: Optional[str] = None,
    role: Optional[str] = None,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    """Retrieve filtered user directory for admin management."""
    query = db.query(User)
    if search:
        query = query.filter((User.name.ilike(f"%{search}%")) | (User.email.ilike(f"%{search}%")))
    if role:
        query = query.filter(User.role == role)
    users = query.order_by(User.created_at.desc()).offset(skip).limit(limit).all()
    return [UserResponse.model_validate(u) for u in users]


@router.get("/courses", response_model=List[CourseResponse])
def get_admin_courses(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    """Retrieve all courses across instructors for moderation."""
    query = db.query(Course)
    if search:
        query = query.filter(Course.title.ilike(f"%{search}%"))
    courses = query.order_by(Course.created_at.desc()).offset(skip).limit(limit).all()
    return [CourseResponse.model_validate(c) for c in courses]


@router.get("/categories", response_model=List[CategoryResponse])
def get_admin_categories(
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    """Retrieve all course categories."""
    categories = db.query(Category).order_by(Category.display_order.asc(), Category.name.asc()).all()
    return [CategoryResponse.model_validate(c) for c in categories]


@router.get("/audit-logs", response_model=List[AuditLogResponse])
def get_audit_logs(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    action: Optional[str] = None,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    """Retrieve immutable audit trail records."""
    query = db.query(AuditLog)
    if action:
        query = query.filter(AuditLog.action == action)
    logs = query.order_by(AuditLog.created_at.desc()).offset(skip).limit(limit).all()
    return [AuditLogResponse.model_validate(l) for l in logs]


@router.get("/system-summary")
def get_system_summary(
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    """Retrieve operational system health overview."""
    total_users = db.query(User).count()
    total_courses = db.query(Course).count()
    total_enrollments = db.query(Enrollment).count()
    total_certificates = db.query(Certificate).count()

    return {
        "status": "healthy",
        "system": {
            "total_users": total_users,
            "total_courses": total_courses,
            "total_enrollments": total_enrollments,
            "total_certificates": total_certificates,
            "version": "1.0.0",
            "environment": "production-ready"
        }
    }

