import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session
from app.models import Certificate, User, Course
from app.services.notification_service import notification_service


class CertificateService:
    @staticmethod
    def generate_certificate_code() -> str:
        # Generate clean human-readable unique certificate code: CERT-XXXX-XXXX
        random_part = uuid.uuid4().hex[:8].upper()
        return f"CERT-{random_part[:4]}-{random_part[4:]}"

    @classmethod
    def issue_certificate(cls, db: Session, user_id: int, course_id: int) -> Certificate:
        # Check if already issued
        existing = (
            db.query(Certificate)
            .filter(Certificate.user_id == user_id, Certificate.course_id == course_id)
            .first()
        )
        if existing:
            return existing

        user = db.query(User).filter(User.id == user_id).first()
        course = db.query(Course).filter(Course.id == course_id).first()
        if not user or not course:
            raise ValueError("User or course not found")

        instructor_name = course.instructor.name if course.instructor else "Platform Instructor"
        code = cls.generate_certificate_code()
        
        certificate = Certificate(
            certificate_code=code,
            user_id=user_id,
            course_id=course_id,
            issued_at=datetime.utcnow(),
            student_name=user.name,
            course_name=course.title,
            instructor_name=instructor_name,
            verification_url=f"/verify-certificate/{code}"
        )
        db.add(certificate)
        db.commit()
        db.refresh(certificate)

        # Send notification to student
        notification_service.create_notification(
            db=db,
            user_id=user_id,
            title="🎉 Course Completed & Certificate Issued!",
            message=f"Congratulations! You completed '{course.title}' and your certificate ({code}) is now ready.",
            notification_type="certificate",
            link_url=f"/verify-certificate/{code}"
        )

        return certificate

    @staticmethod
    def verify_certificate(db: Session, certificate_code: str) -> Optional[Certificate]:
        return (
            db.query(Certificate)
            .filter(Certificate.certificate_code == certificate_code.strip().upper())
            .first()
        )


certificate_service = CertificateService()
