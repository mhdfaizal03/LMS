import re
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_admin_user
from app.models import Category, Course, User
from app.schemas import CategoryCreate, CategoryUpdate, CategoryResponse

router = APIRouter(prefix="/categories", tags=["Categories"])


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    return re.sub(r"[-\s]+", "-", text)


@router.get("", response_model=List[CategoryResponse])
def list_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).filter(Category.is_active == True).order_by(Category.display_order.asc(), Category.name.asc()).all()
    results = []
    for cat in categories:
        c_dict = CategoryResponse.model_validate(cat)
        c_dict.courses_count = db.query(Course).filter(Course.category_id == cat.id).count()
        results.append(c_dict)
    return results


@router.get("/all", response_model=List[CategoryResponse])
def list_all_categories_admin(db: Session = Depends(get_db), admin_user: User = Depends(get_admin_user)):
    categories = db.query(Category).order_by(Category.display_order.asc(), Category.name.asc()).all()
    results = []
    for cat in categories:
        c_dict = CategoryResponse.model_validate(cat)
        c_dict.courses_count = db.query(Course).filter(Course.category_id == cat.id).count()
        results.append(c_dict)
    return results


@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    cat_in: CategoryCreate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    slug = cat_in.slug or slugify(cat_in.name)
    existing = db.query(Category).filter((Category.name == cat_in.name) | (Category.slug == slug)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Category with this name or slug already exists.")

    category = Category(
        name=cat_in.name,
        slug=slug,
        description=cat_in.description,
        icon=cat_in.icon,
        is_active=cat_in.is_active,
        display_order=cat_in.display_order
    )
    db.add(category)
    db.commit()
    db.refresh(category)
    return CategoryResponse.model_validate(category)


@router.put("/{cat_id}", response_model=CategoryResponse)
def update_category(
    cat_id: int,
    cat_update: CategoryUpdate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    category = db.query(Category).filter(Category.id == cat_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    if cat_update.name is not None:
        category.name = cat_update.name
    if cat_update.slug is not None:
        category.slug = cat_update.slug
    if cat_update.description is not None:
        category.description = cat_update.description
    if cat_update.icon is not None:
        category.icon = cat_update.icon
    if cat_update.is_active is not None:
        category.is_active = cat_update.is_active
    if cat_update.display_order is not None:
        category.display_order = cat_update.display_order

    db.commit()
    db.refresh(category)
    return CategoryResponse.model_validate(category)


@router.delete("/{cat_id}")
def delete_category(
    cat_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    category = db.query(Category).filter(Category.id == cat_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    db.delete(category)
    db.commit()
    return {"message": "Category deleted successfully"}
