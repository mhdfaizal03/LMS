from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user, get_instructor_user
from app.models import Quiz, Question, QuizAttempt, QuizAnswer, User, UserRole, Lesson
from app.schemas import (
    QuizCreate, QuizUpdate, QuizResponse, QuestionCreate, QuestionUpdate,
    QuestionResponse, QuestionDetailResponse, QuizSubmitRequest, QuizAttemptResponse
)
from app.services.quiz_service import quiz_service

router = APIRouter(prefix="/quizzes", tags=["Quizzes"])


@router.get("/{quiz_id}", response_model=QuizResponse)
def get_quiz_detail(
    quiz_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    quiz = quiz_service.get_quiz_by_id(db, quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    resp = QuizResponse.model_validate(quiz)

    # Attach user attempt statistics
    attempts = (
        db.query(QuizAttempt)
        .filter(QuizAttempt.quiz_id == quiz_id, QuizAttempt.user_id == current_user.id)
        .all()
    )
    resp.user_attempts_count = len(attempts)
    if attempts:
        resp.best_score_percentage = max(a.percentage for a in attempts)
        resp.is_passed = any(a.is_passed for a in attempts)

    return resp


@router.get("/lesson/{lesson_id}", response_model=QuizResponse)
def get_quiz_for_lesson(
    lesson_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    quiz = db.query(Quiz).filter(Quiz.lesson_id == lesson_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="No quiz assigned to this lesson")

    resp = QuizResponse.model_validate(quiz)
    attempts = (
        db.query(QuizAttempt)
        .filter(QuizAttempt.quiz_id == quiz.id, QuizAttempt.user_id == current_user.id)
        .all()
    )
    resp.user_attempts_count = len(attempts)
    if attempts:
        resp.best_score_percentage = max(a.percentage for a in attempts)
        resp.is_passed = any(a.is_passed for a in attempts)

    return resp


@router.post("/course/{course_id}", response_model=QuizResponse, status_code=status.HTTP_201_CREATED)
def create_quiz(
    course_id: int,
    quiz_in: QuizCreate,
    lesson_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_instructor_user)
):
    quiz = quiz_service.create_quiz(db=db, course_id=course_id, quiz_data=quiz_in, lesson_id=lesson_id)
    return QuizResponse.model_validate(quiz)


@router.put("/{quiz_id}", response_model=QuizResponse)
def update_quiz(
    quiz_id: int,
    quiz_update: QuizUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_instructor_user)
):
    quiz = quiz_service.get_quiz_by_id(db, quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    for field, val in quiz_update.model_dump(exclude_unset=True).items():
        setattr(quiz, field, val)

    db.commit()
    db.refresh(quiz)
    return QuizResponse.model_validate(quiz)


@router.post("/{quiz_id}/questions", response_model=QuestionDetailResponse, status_code=status.HTTP_201_CREATED)
def add_question(
    quiz_id: int,
    q_in: QuestionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_instructor_user)
):
    quiz = quiz_service.get_quiz_by_id(db, quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    max_order = db.query(Question).filter(Question.quiz_id == quiz_id).count()

    question = Question(
        quiz_id=quiz_id,
        question_text=q_in.question_text,
        question_type=q_in.question_type,
        options=q_in.options,
        correct_answers=q_in.correct_answers,
        explanation=q_in.explanation,
        marks=q_in.marks,
        order=q_in.order if q_in.order > 0 else max_order
    )
    db.add(question)
    db.commit()
    db.refresh(question)
    return QuestionDetailResponse.model_validate(question)


@router.delete("/questions/{question_id}")
def delete_question(
    question_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_instructor_user)
):
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    db.delete(question)
    db.commit()
    return {"message": "Question deleted successfully"}


@router.post("/{quiz_id}/submit", response_model=QuizAttemptResponse)
def submit_quiz(
    quiz_id: int,
    submission: QuizSubmitRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        attempt = quiz_service.submit_quiz_attempt(
            db=db,
            quiz_id=quiz_id,
            user_id=current_user.id,
            submission=submission
        )
        return QuizAttemptResponse.model_validate(attempt)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{quiz_id}/attempts", response_model=List[QuizAttemptResponse])
def get_my_attempts(
    quiz_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    attempts = (
        db.query(QuizAttempt)
        .filter(QuizAttempt.quiz_id == quiz_id, QuizAttempt.user_id == current_user.id)
        .order_by(QuizAttempt.attempt_number.desc())
        .all()
    )
    return [QuizAttemptResponse.model_validate(a) for a in attempts]
