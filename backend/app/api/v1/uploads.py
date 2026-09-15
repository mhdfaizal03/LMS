from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from app.core.dependencies import get_current_user
from app.models import User
from app.services.storage_service import storage_service

router = APIRouter(prefix="/uploads", tags=["Uploads"])


@router.post("", status_code=status.HTTP_201_CREATED)
async def upload_file(
    file: UploadFile = File(...),
    subfolder: str = Form("general"),
    current_user: User = Depends(get_current_user)
):
    # Sanitize subfolder name
    allowed_folders = ["thumbnails", "avatars", "videos", "audios", "documents", "assignments", "general"]
    if subfolder not in allowed_folders:
        subfolder = "general"

    upload_result = await storage_service.save_upload_file(file, subfolder=subfolder)
    return {
        "url": upload_result["url"],
        "filename": upload_result.get("filename", file.filename),
        "content_type": file.content_type,
        "public_id": upload_result.get("public_id"),
        "resource_type": upload_result.get("resource_type"),
        "bytes": upload_result.get("bytes")
    }
