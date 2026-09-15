import re
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from app.core.database import get_db
from app.core.dependencies import get_current_user, get_optional_current_user, get_instructor_user
from app.models import (
    Course, Category, Section, Lesson, Enrollment, User, UserRole, CourseStatus, DifficultyLevel, AuditLog
)
from app.schemas import (
    CourseCreate, CourseUpdate, CourseResponse, CourseDetailResponse
)

router = APIRouter(prefix="/courses", tags=["Courses"])


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    slug = re.sub(r"[-\s]+", "-", text)
    return slug


@router.get("", response_model=List[CourseResponse])
def list_courses(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    category_id: Optional[int] = None,
    difficulty: Optional[DifficultyLevel] = None,
    sort_by: Optional[str] = Query("popular", pattern="^(popular|newest|price_asc|price_desc)$"),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    query = db.query(Course).filter(Course.status == CourseStatus.PUBLISHED)

    if search:
        search_fmt = f"%{search.strip()}%"
        query = query.filter((Course.title.ilike(search_fmt)) | (Course.short_description.ilike(search_fmt)))
    if category_id:
        query = query.filter(Course.category_id == category_id)
    if difficulty:
        query = query.filter(Course.difficulty_level == difficulty)

    if sort_by == "newest":
        query = query.order_by(Course.created_at.desc())
    elif sort_by == "price_asc":
        query = query.order_by(Course.price.asc())
    elif sort_by == "price_desc":
        query = query.order_by(Course.price.desc())
    else:
        query = query.order_by(Course.created_at.desc())

    courses = query.offset(skip).limit(limit).all()
    results = []
    
    # Check enrollments for current user
    user_enrolled_map = {}
    if current_user:
        enrollments = db.query(Enrollment).filter(Enrollment.user_id == current_user.id).all()
        user_enrolled_map = {e.course_id: e for e in enrollments}

    for c in courses:
        resp = CourseResponse.model_validate(c)
        resp.students_count = db.query(Enrollment).filter(Enrollment.course_id == c.id).count()
        resp.lessons_count = (
            db.query(Lesson)
            .join(Section, Lesson.section_id == Section.id)
            .filter(Section.course_id == c.id)
            .count()
        )
        if c.id in user_enrolled_map:
            resp.is_enrolled = True
            resp.progress_percentage = user_enrolled_map[c.id].progress_percentage
        results.append(resp)

    return results


@router.get("/instructor/my-courses", response_model=List[CourseResponse])
def list_my_instructor_courses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_instructor_user)
):
    query = db.query(Course)
    if current_user.role not in [UserRole.ADMIN, UserRole.SUPERADMIN]:
        query = query.filter(Course.instructor_id == current_user.id)
    
    courses = query.order_by(Course.updated_at.desc()).all()
    results = []
    for c in courses:
        resp = CourseResponse.model_validate(c)
        resp.students_count = db.query(Enrollment).filter(Enrollment.course_id == c.id).count()
        resp.lessons_count = (
            db.query(Lesson)
            .join(Section, Lesson.section_id == Section.id)
            .filter(Section.course_id == c.id)
            .count()
        )
        results.append(resp)
    return results


@router.get("/{course_id_or_slug}", response_model=CourseDetailResponse)
def get_course_detail(
    course_id_or_slug: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    query = db.query(Course)
    if course_id_or_slug.isdigit():
        course = query.filter(Course.id == int(course_id_or_slug)).first()
    else:
        course = query.filter(Course.slug == course_id_or_slug).first()

    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    # If course is draft or archived, only instructor or admin can view
    if course.status != CourseStatus.PUBLISHED:
        if not current_user or (
            current_user.role not in [UserRole.ADMIN, UserRole.SUPERADMIN] and current_user.id != course.instructor_id
        ):
            raise HTTPException(status_code=403, detail="This course is not currently published.")

    resp = CourseDetailResponse.model_validate(course)
    resp.students_count = db.query(Enrollment).filter(Enrollment.course_id == course.id).count()
    resp.lessons_count = (
        db.query(Lesson)
        .join(Section, Lesson.section_id == Section.id)
        .filter(Section.course_id == course.id)
        .count()
    )

    if current_user:
        enrollment = (
            db.query(Enrollment)
            .filter(Enrollment.user_id == current_user.id, Enrollment.course_id == course.id)
            .first()
        )
        if enrollment:
            resp.is_enrolled = True
            resp.progress_percentage = enrollment.progress_percentage

    return resp


@router.post("", response_model=CourseDetailResponse, status_code=status.HTTP_201_CREATED)
def create_course(
    course_in: CourseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_instructor_user)
):
    base_slug = slugify(course_in.title)
    slug = base_slug
    # Ensure unique slug
    suffix = 1
    while db.query(Course).filter(Course.slug == slug).first():
        slug = f"{base_slug}-{suffix}"
        suffix += 1

    course = Course(
        title=course_in.title,
        slug=slug,
        short_description=course_in.short_description,
        full_description=course_in.full_description,
        thumbnail=course_in.thumbnail,
        category_id=course_in.category_id,
        instructor_id=current_user.id,
        difficulty_level=course_in.difficulty_level,
        language=course_in.language,
        price=course_in.price,
        is_free=course_in.is_free,
        status=course_in.status,
        duration_minutes=course_in.duration_minutes,
        learning_objectives=course_in.learning_objectives,
        requirements=course_in.requirements,
        tags=course_in.tags
    )
    db.add(course)
    db.commit()
    db.refresh(course)

    # Add a default initial module/section
    default_section = Section(
        course_id=course.id,
        title="Module 1: Getting Started",
        description="Introduction and foundational concepts",
        order=0
    )
    db.add(default_section)
    db.commit()
    db.refresh(course)

    return CourseDetailResponse.model_validate(course)


@router.put("/{course_id}", response_model=CourseDetailResponse)
def update_course(
    course_id: int,
    course_update: CourseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_instructor_user)
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    # Authorization check
    if current_user.role not in [UserRole.ADMIN, UserRole.SUPERADMIN] and course.instructor_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only edit your own courses.")

    for field, value in course_update.model_dump(exclude_unset=True).items():
        if field == "title" and value != course.title:
            # Update slug
            base_slug = slugify(value)
            slug = base_slug
            suffix = 1
            while db.query(Course).filter(Course.slug == slug, Course.id != course.id).first():
                slug = f"{base_slug}-{suffix}"
                suffix += 1
            course.slug = slug
        setattr(course, field, value)

    db.commit()
    db.refresh(course)
    return CourseDetailResponse.model_validate(course)


@router.delete("/{course_id}")
def delete_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_instructor_user)
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    if current_user.role not in [UserRole.ADMIN, UserRole.SUPERADMIN] and course.instructor_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only delete your own courses.")

    db.delete(course)
    db.commit()
    return {"message": "Course deleted successfully"}
