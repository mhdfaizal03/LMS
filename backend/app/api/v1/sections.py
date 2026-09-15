from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_instructor_user
from app.models import Course, Section, User, UserRole
from app.schemas import SectionCreate, SectionUpdate, SectionResponse

router = APIRouter(prefix="/sections", tags=["Sections & Curriculum"])


@router.post("/course/{course_id}", response_model=SectionResponse, status_code=status.HTTP_201_CREATED)
def create_section(
    course_id: int,
    section_in: SectionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_instructor_user)
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    if current_user.role not in [UserRole.ADMIN, UserRole.SUPERADMIN] and course.instructor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this course")

    max_order = db.query(Section).filter(Section.course_id == course_id).count()

    section = Section(
        course_id=course_id,
        title=section_in.title,
        description=section_in.description,
        order=section_in.order if section_in.order > 0 else max_order
    )
    db.add(section)
    db.commit()
    db.refresh(section)
    return SectionResponse.model_validate(section)


@router.put("/{section_id}", response_model=SectionResponse)
def update_section(
    section_id: int,
    section_update: SectionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_instructor_user)
):
    section = db.query(Section).filter(Section.id == section_id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")

    if current_user.role not in [UserRole.ADMIN, UserRole.SUPERADMIN] and section.course.instructor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this section")

    if section_update.title is not None:
        section.title = section_update.title
    if section_update.description is not None:
        section.description = section_update.description
    if section_update.order is not None:
        section.order = section_update.order

    db.commit()
    db.refresh(section)
    return SectionResponse.model_validate(section)


@router.delete("/{section_id}")
def delete_section(
    section_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_instructor_user)
):
    section = db.query(Section).filter(Section.id == section_id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")

    if current_user.role not in [UserRole.ADMIN, UserRole.SUPERADMIN] and section.course.instructor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this section")

    db.delete(section)
    db.commit()
    return {"message": "Section deleted successfully"}
