from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_admin_user
from app.core.security import hash_password
from app.models import User, UserRole, UserStatus, AuditLog
from app.schemas import UserResponse, UserUpdate, UserCreate

router = APIRouter(prefix="/users", tags=["Users Management"])


@router.get("", response_model=List[UserResponse])
def list_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    search: Optional[str] = None,
    role: Optional[UserRole] = None,
    status_filter: Optional[UserStatus] = None,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    query = db.query(User)
    if search:
        search_fmt = f"%{search.strip()}%"
        query = query.filter((User.name.ilike(search_fmt)) | (User.email.ilike(search_fmt)))
    if role:
        query = query.filter(User.role == role)
    if status_filter:
        query = query.filter(User.status == status_filter)

    users = query.order_by(User.created_at.desc()).offset(skip).limit(limit).all()
    return [UserResponse.model_validate(u) for u in users]


@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user_by_admin(
    user_in: UserCreate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    existing = db.query(User).filter(User.email == user_in.email.lower()).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists.")

    new_user = User(
        name=user_in.name,
        email=user_in.email.lower(),
        password_hash=hash_password(user_in.password),
        role=user_in.role or UserRole.STUDENT,
        phone=user_in.phone,
        bio=user_in.bio,
        expertise=user_in.expertise,
        status=UserStatus.ACTIVE
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Log action
    log = AuditLog(
        user_id=admin_user.id,
        action="CREATE_USER",
        target_type="user",
        target_id=str(new_user.id),
        details={"email": new_user.email, "role": new_user.role}
    )
    db.add(log)
    db.commit()

    return UserResponse.model_validate(new_user)


@router.get("/{user_id}", response_model=UserResponse)
def get_user_detail(
    user_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse.model_validate(user)


@router.put("/{user_id}", response_model=UserResponse)
def update_user_by_admin(
    user_id: int,
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Prevent non-superadmins from modifying superadmins
    if user.role == UserRole.SUPERADMIN and admin_user.role != UserRole.SUPERADMIN:
        raise HTTPException(status_code=403, detail="Only superadmins can modify superadmin accounts.")

    if user_update.name is not None:
        user.name = user_update.name
    if user_update.phone is not None:
        user.phone = user_update.phone
    if user_update.bio is not None:
        user.bio = user_update.bio
    if user_update.expertise is not None:
        user.expertise = user_update.expertise
    if user_update.profile_image is not None:
        user.profile_image = user_update.profile_image
    if user_update.status is not None:
        user.status = user_update.status
    if user_update.role is not None:
        user.role = user_update.role
    if user_update.password:
        user.password_hash = hash_password(user_update.password)

    db.commit()
    db.refresh(user)

    # Log action
    log = AuditLog(
        user_id=admin_user.id,
        action="UPDATE_USER",
        target_type="user",
        target_id=str(user.id),
        details={"status": user.status, "role": user.role}
    )
    db.add(log)
    db.commit()

    return UserResponse.model_validate(user)


@router.delete("/{user_id}")
def delete_user_by_admin(
    user_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    if user_id == admin_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account.")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.role == UserRole.SUPERADMIN and admin_user.role != UserRole.SUPERADMIN:
        raise HTTPException(status_code=403, detail="Superadmins cannot be deleted.")

    db.delete(user)
    db.commit()

    # Log action
    log = AuditLog(
        user_id=admin_user.id,
        action="DELETE_USER",
        target_type="user",
        target_id=str(user_id),
        details={"deleted_user_email": user.email}
    )
    db.add(log)
    db.commit()

    return {"message": "User deleted successfully"}
