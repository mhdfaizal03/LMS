from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_instructor_user
from app.models import User, Course, AssignmentSubmission, Assignment
from app.schemas import (
    CourseResponse, AssignmentSubmissionResponse, InstructorDashboardStats
)
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/instructor", tags=["Instructor Role API"])


@router.get("/dashboard", response_model=InstructorDashboardStats)
def get_instructor_dashboard(
    db: Session = Depends(get_db),
    instructor_user: User = Depends(get_instructor_user)
):
    """Retrieve comprehensive dashboard stats for the authenticated instructor."""
    return AnalyticsService.get_instructor_dashboard(db, instructor_user.id)


@router.get("/courses", response_model=List[CourseResponse])
def get_instructor_courses(
    db: Session = Depends(get_db),
    instructor_user: User = Depends(get_instructor_user)
):
    """Retrieve all courses created by the authenticated instructor."""
    courses = db.query(Course).filter(
        Course.instructor_id == instructor_user.id
    ).order_by(Course.created_at.desc()).all()
    return [CourseResponse.model_validate(c) for c in courses]


@router.get("/assignments/submissions", response_model=List[AssignmentSubmissionResponse])
def get_instructor_submissions(
    course_id: Optional[int] = None,
    db: Session = Depends(get_db),
    instructor_user: User = Depends(get_instructor_user)
):
    """Retrieve submissions requiring review or grading for this instructor's courses."""
    query = db.query(AssignmentSubmission).join(Assignment).join(Course).filter(
        Course.instructor_id == instructor_user.id
    )
    if course_id:
        query = query.filter(Assignment.course_id == course_id)
    
    submissions = query.order_by(AssignmentSubmission.submitted_at.desc()).all()
    return [AssignmentSubmissionResponse.model_validate(s) for s in submissions]


@router.get("/analytics", response_model=InstructorDashboardStats)
def get_instructor_analytics(
    db: Session = Depends(get_db),
    instructor_user: User = Depends(get_instructor_user)
):
    """Retrieve detailed analytics for the authenticated instructor."""
    return AnalyticsService.get_instructor_dashboard(db, instructor_user.id)
