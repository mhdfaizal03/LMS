from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user, get_instructor_user
from app.models import Assignment, AssignmentSubmission, User, UserRole
from app.schemas import (
    AssignmentCreate, AssignmentUpdate, AssignmentResponse,
    AssignmentSubmissionCreate, AssignmentGradeRequest, AssignmentSubmissionResponse
)
from app.services.assignment_service import assignment_service

router = APIRouter(prefix="/assignments", tags=["Assignments"])


@router.get("/{assignment_id}", response_model=AssignmentResponse)
def get_assignment_detail(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    assignment = assignment_service.get_assignment(db, assignment_id)
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    resp = AssignmentResponse.model_validate(assignment)

    # Attach student's submission if exists
    sub = (
        db.query(AssignmentSubmission)
        .filter(AssignmentSubmission.assignment_id == assignment_id, AssignmentSubmission.user_id == current_user.id)
        .first()
    )
    if sub:
        resp.my_submission = AssignmentSubmissionResponse.model_validate(sub)

    return resp


@router.get("/lesson/{lesson_id}", response_model=AssignmentResponse)
def get_assignment_for_lesson(
    lesson_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    assignment = db.query(Assignment).filter(Assignment.lesson_id == lesson_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="No assignment for this lesson")

    resp = AssignmentResponse.model_validate(assignment)
    sub = (
        db.query(AssignmentSubmission)
        .filter(AssignmentSubmission.assignment_id == assignment.id, AssignmentSubmission.user_id == current_user.id)
        .first()
    )
    if sub:
        resp.my_submission = AssignmentSubmissionResponse.model_validate(sub)
    return resp


@router.post("/course/{course_id}", response_model=AssignmentResponse, status_code=status.HTTP_201_CREATED)
def create_assignment(
    course_id: int,
    data: AssignmentCreate,
    lesson_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_instructor_user)
):
    assignment = assignment_service.create_assignment(db=db, course_id=course_id, data=data, lesson_id=lesson_id)
    return AssignmentResponse.model_validate(assignment)


@router.post("/{assignment_id}/submit", response_model=AssignmentSubmissionResponse)
def submit_assignment(
    assignment_id: int,
    submission_data: AssignmentSubmissionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        sub = assignment_service.submit_assignment(
            db=db,
            assignment_id=assignment_id,
            user_id=current_user.id,
            data=submission_data
        )
        return AssignmentSubmissionResponse.model_validate(sub)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{assignment_id}/submissions", response_model=List[AssignmentSubmissionResponse])
def list_assignment_submissions(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_instructor_user)
):
    submissions = (
        db.query(AssignmentSubmission)
        .filter(AssignmentSubmission.assignment_id == assignment_id)
        .order_by(AssignmentSubmission.submitted_at.desc())
        .all()
    )
    return [AssignmentSubmissionResponse.model_validate(s) for s in submissions]


@router.post("/submissions/{submission_id}/grade", response_model=AssignmentSubmissionResponse)
def grade_submission(
    submission_id: int,
    grade_data: AssignmentGradeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_instructor_user)
):
    try:
        sub = assignment_service.grade_submission(
            db=db,
            submission_id=submission_id,
            instructor_id=current_user.id,
            grade_data=grade_data
        )
        return AssignmentSubmissionResponse.model_validate(sub)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
