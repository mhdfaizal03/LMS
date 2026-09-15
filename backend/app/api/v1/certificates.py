from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models import Certificate, User
from app.schemas import CertificateResponse, CertificateVerifyResponse
from app.services.certificate_service import certificate_service

router = APIRouter(prefix="/certificates", tags=["Certificates"])


@router.get("/my-certificates", response_model=List[CertificateResponse])
def get_my_certificates(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    certs = (
        db.query(Certificate)
        .filter(Certificate.user_id == current_user.id)
        .order_by(Certificate.issued_at.desc())
        .all()
    )
    return [CertificateResponse.model_validate(c) for c in certs]


@router.get("/verify/{certificate_code}", response_model=CertificateVerifyResponse)
def verify_certificate_public(
    certificate_code: str,
    db: Session = Depends(get_db)
):
    cert = certificate_service.verify_certificate(db, certificate_code)
    if not cert:
        return CertificateVerifyResponse(
            is_valid=False,
            certificate=None,
            message="Certificate not found or verification code is invalid."
        )

    return CertificateVerifyResponse(
        is_valid=True,
        certificate=CertificateResponse.model_validate(cert),
        message="Certificate verified successfully! This credential is valid and authentic."
    )
