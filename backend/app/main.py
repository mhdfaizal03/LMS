from contextlib import asynccontextmanager
import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.core.database import Base, engine
from app.api.v1 import (
    auth, users, categories, courses, sections, lessons,
    enrollments, progress, quizzes, assignments, certificates,
    notifications, announcements, analytics, uploads, admin,
    student, instructor
)

from app.seed import seed_if_empty

# Initialize database schema tables
Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    seed_if_empty()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan
)


# CORS configuration - Allow all HTTPS & HTTP origins dynamically with credentials
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"^https?:\/\/.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


# Mount static uploaded files
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Global exception handler for uncaught errors
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected internal server error occurred. Please try again."}
    )

# Include API v1 Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(users.router, prefix=settings.API_V1_STR)
app.include_router(categories.router, prefix=settings.API_V1_STR)
app.include_router(courses.router, prefix=settings.API_V1_STR)
app.include_router(sections.router, prefix=settings.API_V1_STR)
app.include_router(lessons.router, prefix=settings.API_V1_STR)
app.include_router(enrollments.router, prefix=settings.API_V1_STR)
app.include_router(progress.router, prefix=settings.API_V1_STR)
app.include_router(quizzes.router, prefix=settings.API_V1_STR)
app.include_router(assignments.router, prefix=settings.API_V1_STR)
app.include_router(certificates.router, prefix=settings.API_V1_STR)
app.include_router(notifications.router, prefix=settings.API_V1_STR)
app.include_router(announcements.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)
app.include_router(uploads.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)
app.include_router(student.router, prefix=settings.API_V1_STR)
app.include_router(instructor.router, prefix=settings.API_V1_STR)



@app.get("/")
def root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME} API",
        "docs": f"{settings.API_V1_STR}/docs",
        "version": "1.0.0",
        "status": "online"
    }
