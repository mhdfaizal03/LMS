import os
from typing import List, Union
from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl, field_validator


class Settings(BaseSettings):
    PROJECT_NAME: str = "Modern LMS Platform"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "super-secret-production-grade-key-for-jwt-signing-change-in-prod-12345"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database
    DATABASE_URL: str = "sqlite:///./lms.db"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]

    # File storage
    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "uploads")
    MAX_UPLOAD_SIZE_MB: int = 250
    ALLOWED_EXTENSIONS: List[str] = [
        "jpg", "jpeg", "png", "webp", "svg", "gif",
        "mp4", "webm", "mov", "mkv", "avi", "m4v",
        "mp3", "wav", "ogg", "aac", "m4a", "flac",
        "pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "txt",
        "zip", "rar", "tar", "gz", "7z"
    ]

    # Cloudinary storage
    CLOUDINARY_CLOUD_NAME: str = "ml_default"
    CLOUDINARY_API_KEY: str = "764422355995382"
    CLOUDINARY_API_SECRET: str = "wzIDt73N9dHivDKEB1QcodZZNeU"
    CLOUDINARY_UPLOAD_PRESET: str = "ml_default"

    class Config:
        case_sensitive = True
        env_file = ".env"


settings = Settings()

# Configure Cloudinary
try:
    import cloudinary
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
        secure=True
    )
except Exception as e:
    print(f"Warning: Cloudinary initialization error: {e}")

# Ensure local fallback uploads directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
