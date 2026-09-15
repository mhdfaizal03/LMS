import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.database import Base, get_db
from app.core.security import hash_password, create_access_token
from app.models import User, UserRole, UserStatus
from app.main import app

# Test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_lms.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def db():
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    yield session

    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def admin_user(db):
    user = User(
        name="Admin Test",
        email="admin.test@lms.com",
        password_hash=hash_password("AdminPass123"),
        role=UserRole.ADMIN,
        status=UserStatus.ACTIVE
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture
def instructor_user(db):
    user = User(
        name="Instructor Test",
        email="instructor.test@lms.com",
        password_hash=hash_password("InstructorPass123"),
        role=UserRole.INSTRUCTOR,
        status=UserStatus.ACTIVE
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture
def student_user(db):
    user = User(
        name="Student Test",
        email="student.test@lms.com",
        password_hash=hash_password("StudentPass123"),
        role=UserRole.STUDENT,
        status=UserStatus.ACTIVE
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture
def student_auth_headers(student_user):
    token = create_access_token(student_user.id)
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def instructor_auth_headers(instructor_user):
    token = create_access_token(instructor_user.id)
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def admin_auth_headers(admin_user):
    token = create_access_token(admin_user.id)
    return {"Authorization": f"Bearer {token}"}
