from datetime import datetime
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models import (
    Quiz, Question, QuizAttempt, QuizAnswer, LessonProgress, QuestionType
)
from app.schemas import QuizCreate, QuizUpdate, QuizSubmitRequest
from app.services.progress_service import progress_service
from app.services.notification_service import notification_service


class QuizService:
    @staticmethod
    def get_quiz_by_id(db: Session, quiz_id: int) -> Optional[Quiz]:
        return db.query(Quiz).filter(Quiz.id == quiz_id).first()

    @staticmethod
    def create_quiz(db: Session, course_id: int, quiz_data: QuizCreate, lesson_id: Optional[int] = None) -> Quiz:
        quiz = Quiz(
            course_id=course_id,
            lesson_id=lesson_id,
            title=quiz_data.title,
            description=quiz_data.description,
            instructions=quiz_data.instructions,
            time_limit_minutes=quiz_data.time_limit_minutes,
            passing_score=quiz_data.passing_score,
            max_attempts=quiz_data.max_attempts,
            is_randomized=quiz_data.is_randomized
        )
        db.add(quiz)
        db.commit()
        db.refresh(quiz)

        # Add questions if provided
        if quiz_data.questions:
            for idx, q_data in enumerate(quiz_data.questions):
                question = Question(
                    quiz_id=quiz.id,
                    question_text=q_data.question_text,
                    question_type=q_data.question_type,
                    options=q_data.options,
                    correct_answers=q_data.correct_answers,
                    explanation=q_data.explanation,
                    marks=q_data.marks,
                    order=idx
                )
                db.add(question)
            db.commit()
            db.refresh(quiz)

        return quiz

    @staticmethod
    def submit_quiz_attempt(
        db: Session,
        quiz_id: int,
        user_id: int,
        submission: QuizSubmitRequest
    ) -> QuizAttempt:
        quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
        if not quiz:
            raise ValueError("Quiz not found")

        # Check existing attempts
        previous_attempts = (
            db.query(QuizAttempt)
            .filter(QuizAttempt.quiz_id == quiz_id, QuizAttempt.user_id == user_id)
            .count()
        )
        if previous_attempts >= quiz.max_attempts:
            raise ValueError(f"You have reached the maximum allowed attempts ({quiz.max_attempts}) for this quiz.")

        questions = db.query(Question).filter(Question.quiz_id == quiz_id).all()
        q_map = {q.id: q for q in questions}

        total_marks = sum(q.marks for q in questions) if questions else 1.0
        earned_marks = 0.0

        attempt = QuizAttempt(
            quiz_id=quiz_id,
            user_id=user_id,
            max_score=total_marks,
            attempt_number=previous_attempts + 1,
            started_at=datetime.utcnow(),
            completed_at=datetime.utcnow()
        )
        db.add(attempt)
        db.commit()
        db.refresh(attempt)

        # Grade each submitted answer
        for ans in submission.answers:
            question = q_map.get(ans.question_id)
            if not question:
                continue

            is_correct = False
            marks_awarded = 0.0

            # Compare answers depending on type
            correct_set = set(str(c).strip().lower() for c in question.correct_answers)
            if isinstance(ans.user_answer, list):
                user_set = set(str(u).strip().lower() for u in ans.user_answer)
                if user_set == correct_set:
                    is_correct = True
                    marks_awarded = question.marks
            else:
                user_val = str(ans.user_answer).strip().lower()
                if user_val in correct_set:
                    is_correct = True
                    marks_awarded = question.marks

            earned_marks += marks_awarded

            quiz_answer = QuizAnswer(
                attempt_id=attempt.id,
                question_id=question.id,
                user_answer=ans.user_answer,
                is_correct=is_correct,
                marks_awarded=marks_awarded
            )
            db.add(quiz_answer)

        percentage = round((earned_marks / total_marks * 100.0), 1) if total_marks > 0 else 0.0
        is_passed = percentage >= quiz.passing_score

        attempt.score = earned_marks
        attempt.percentage = percentage
        attempt.is_passed = is_passed
        db.commit()
        db.refresh(attempt)

        # If quiz belongs to a lesson and was passed, mark the lesson as complete
        if is_passed and quiz.lesson_id:
            progress_service.update_lesson_progress(
                db=db,
                user_id=user_id,
                lesson_id=quiz.lesson_id,
                is_completed=True
            )

        # Notify student of quiz result
        status_text = "Passed 🎉" if is_passed else "Needs Improvement"
        notification_service.create_notification(
            db=db,
            user_id=user_id,
            title=f"Quiz Graded: {quiz.title}",
            message=f"You scored {percentage}% ({earned_marks}/{total_marks} pts) - {status_text}",
            notification_type="quiz",
            link_url=f"/learn/{quiz.course_id}?lesson={quiz.lesson_id}" if quiz.lesson_id else None
        )

        return attempt


quiz_service = QuizService()
