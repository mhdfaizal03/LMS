import os
import uuid
import aiofiles
from fastapi import UploadFile, HTTPException, status
from app.core.config import settings

try:
    import cloudinary
    import cloudinary.uploader
    CLOUDINARY_AVAILABLE = True
except ImportError:
    CLOUDINARY_AVAILABLE = False


class StorageService:
    @staticmethod
    async def save_upload_file(file: UploadFile, subfolder: str = "general") -> dict:
        if not file.filename:
            raise HTTPException(status_code=400, detail="Uploaded file has no filename")
        
        # Check extension
        ext = file.filename.split(".")[-1].lower() if "." in file.filename else ""
        allowed_extensions = settings.ALLOWED_EXTENSIONS + ["mp3", "wav", "ogg", "aac", "m4a", "mov", "svg"]
        if ext not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"File extension '.{ext}' is not allowed. Allowed: {', '.join(allowed_extensions)}"
            )
        
        # Read file bytes
        content = await file.read()
        
        # Validate size (max 50MB)
        max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
        if len(content) > max_bytes:
            raise HTTPException(
                status_code=400,
                detail=f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_MB}MB"
            )
        
        # Detect resource type for Cloudinary
        resource_type = "auto"
        if ext in ["mp4", "webm", "mov", "mkv", "mp3", "wav", "ogg", "aac", "m4a"]:
            resource_type = "video"  # Cloudinary handles audio/video under video resource_type
        elif ext in ["jpg", "jpeg", "png", "webp", "svg", "gif"]:
            resource_type = "image"
        elif ext in ["pdf", "zip", "doc", "docx", "txt"]:
            resource_type = "raw"

        # Try Cloudinary upload
        if CLOUDINARY_AVAILABLE and settings.CLOUDINARY_CLOUD_NAME:
            try:
                folder_name = f"learnflow/{subfolder}"
                result = cloudinary.uploader.upload(
                    content,
                    folder=folder_name,
                    resource_type=resource_type,
                    use_filename=True,
                    unique_filename=True,
                    overwrite=False
                )
                secure_url = result.get("secure_url") or result.get("url")
                if secure_url:
                    return {
                        "url": secure_url,
                        "public_id": result.get("public_id"),
                        "resource_type": result.get("resource_type", resource_type),
                        "format": result.get("format", ext),
                        "bytes": result.get("bytes", len(content)),
                        "filename": file.filename
                    }
            except Exception as e:
                print(f"Cloudinary upload notice/fallback: {e}")
        
        # Fallback to local storage if Cloudinary is unreachable or local dev
        folder_path = os.path.join(settings.UPLOAD_DIR, subfolder)
        os.makedirs(folder_path, exist_ok=True)
        unique_name = f"{uuid.uuid4().hex}.{ext}"
        destination_path = os.path.join(folder_path, unique_name)
        
        async with aiofiles.open(destination_path, "wb") as f:
            await f.write(content)
        
        return {
            "url": f"/uploads/{subfolder}/{unique_name}",
            "public_id": unique_name,
            "resource_type": resource_type,
            "format": ext,
            "bytes": len(content),
            "filename": file.filename
        }


storage_service = StorageService()
