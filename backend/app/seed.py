from datetime import datetime, timedelta
from app.core.database import SessionLocal, engine, Base
from app.core.security import hash_password
from app.models import (
    User, UserRole, UserStatus, Category, Course, Section, Lesson,
    LessonType, CourseStatus, DifficultyLevel, Quiz, Question, QuestionType,
    QuizAttempt, QuizAnswer, Assignment, AssignmentSubmission, SubmissionStatus,
    Enrollment, LessonProgress, Certificate, Notification, Announcement, AuditLog
)


def seed_database():
    print("🌱 Initializing fresh database schema...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        print("👤 Creating demo users (Admin, Instructors, Students)...")
        # 1. Users
        superadmin = User(
            name="Platform SuperAdmin",
            email="admin@lms.com",
            password_hash=hash_password("Admin@123456"),
            role=UserRole.SUPERADMIN,
            bio="Lead Administrator overseeing LMS operations, security, and curriculum quality.",
            status=UserStatus.ACTIVE
        )
        instructor1 = User(
            name="Dr. Sarah Jenkins",
            email="sarah.instructor@lms.com",
            password_hash=hash_password("Instructor@123"),
            role=UserRole.INSTRUCTOR,
            bio="Senior Full-Stack Architect with 12+ years building enterprise web and distributed systems.",
            expertise="React, TypeScript, Python, FastAPI, Microservices",
            status=UserStatus.ACTIVE
        )
        instructor2 = User(
            name="Alex Rivera",
            email="alex.dev@lms.com",
            password_hash=hash_password("Instructor@123"),
            role=UserRole.INSTRUCTOR,
            bio="Data Scientist & AI Researcher passionate about machine learning and deep learning pipelines.",
            expertise="Python, PyTorch, LangChain, Data Engineering",
            status=UserStatus.ACTIVE
        )
        student1 = User(
            name="Emma Watson",
            email="emma.student@lms.com",
            password_hash=hash_password("Student@123"),
            role=UserRole.STUDENT,
            bio="Dedicated software engineering student pursuing mastery in modern cloud and web stacks.",
            status=UserStatus.ACTIVE
        )
        student2 = User(
            name="Michael Chen",
            email="michael.student@lms.com",
            password_hash=hash_password("Student@123"),
            role=UserRole.STUDENT,
            bio="Aspiring full-stack engineer and open source enthusiast.",
            status=UserStatus.ACTIVE
        )

        db.add_all([superadmin, instructor1, instructor2, student1, student2])
        db.commit()

        print("🏷️ Creating categories...")
        # 2. Categories
        cat_web = Category(name="Web Development", slug="web-development", description="Modern front-end, back-end, and full-stack engineering frameworks", icon="code", display_order=1)
        cat_ai = Category(name="AI & Data Science", slug="ai-data-science", description="Artificial intelligence, neural networks, machine learning, and data analytics", icon="cpu", display_order=2)
        cat_cloud = Category(name="Cloud & DevOps", slug="cloud-devops", description="Docker, Kubernetes, AWS, CI/CD automation, and scalable cloud architecture", icon="cloud", display_order=3)
        cat_ui = Category(name="UI/UX Design", slug="ui-ux-design", description="Design systems, Figma, user research, wireframing, and interactive design", icon="layout", display_order=4)

        db.add_all([cat_web, cat_ai, cat_cloud, cat_ui])
        db.commit()

        print("📚 Creating rich courses, modules, lessons, quizzes, and assignments...")
        # 3. Course 1: Full-Stack React & FastAPI Mastery
        course1 = Course(
            title="Complete Full-Stack Engineering with React, FastAPI & TypeScript",
            slug="fullstack-react-fastapi-mastery",
            short_description="Master modern full-stack web development from scratch using TypeScript, React 18, FastAPI, and PostgreSQL.",
            full_description="""### What You Will Learn
This comprehensive course takes you from zero to production. You will build high-scale, secure web applications combining the speed of FastAPI with the power of modern React and TypeScript.

#### Core Modules Covered:
- Modern Python async programming and FastAPI API architecture
- Relational schema modeling with SQLAlchemy 2.0 and Alembic
- JWT Authentication, RBAC, and secure token lifecycle management
- React 18 component patterns, hooks, and clean state architectures
- Real-time client-server communication and performance optimization
- Dockerizing and deploying to production cloud infrastructure
""",
            category_id=cat_web.id,
            instructor_id=instructor1.id,
            difficulty_level=DifficultyLevel.INTERMEDIATE,
            language="English",
            price=49.99,
            is_free=False,
            status=CourseStatus.PUBLISHED,
            duration_minutes=360,
            learning_objectives=[
                "Architect scalable REST APIs using FastAPI and Pydantic v2",
                "Implement bulletproof JWT authentication and Role-Based Access Control",
                "Build dynamic, responsive client applications with React & TypeScript",
                "Deploy production-ready microservices with Docker and PostgreSQL"
            ],
            requirements=[
                "Basic understanding of JavaScript / Python syntax",
                "Computer with Node.js and Python installed",
                "Enthusiasm for building real-world software"
            ],
            tags=["FastAPI", "React", "TypeScript", "Python", "FullStack"]
        )

        # 4. Course 2: Practical Data Science & Machine Learning
        course2 = Course(
            title="Practical Data Science & Deep Learning with PyTorch",
            slug="practical-data-science-pytorch",
            short_description="Learn data analysis, statistical modeling, feature engineering, and neural network training with Python.",
            full_description="""Dive deep into the world of Artificial Intelligence. From foundational Pandas data wrangling to training deep convolutional and transformer models with PyTorch.""",
            category_id=cat_ai.id,
            instructor_id=instructor2.id,
            difficulty_level=DifficultyLevel.BEGINNER,
            language="English",
            price=0.0,
            is_free=True,
            status=CourseStatus.PUBLISHED,
            duration_minutes=240,
            learning_objectives=[
                "Clean, analyze, and visualize complex datasets with Pandas & Seaborn",
                "Build and evaluate supervised and unsupervised machine learning models",
                "Implement neural networks and computer vision models using PyTorch"
            ],
            requirements=["Basic Python programming knowledge"],
            tags=["Python", "MachineLearning", "PyTorch", "DataScience"]
        )

        # 5. Course 3: Cloud Native DevOps & Kubernetes
        course3 = Course(
            title="Cloud-Native DevOps: Docker, Kubernetes & CI/CD Pipelines",
            slug="cloud-native-devops-kubernetes",
            short_description="Master containerization, cluster orchestration, Helm charts, and continuous automated deployment pipelines.",
            full_description="""A hands-on guide for developers and system administrators to master modern cloud deployment tools.""",
            category_id=cat_cloud.id,
            instructor_id=instructor1.id,
            difficulty_level=DifficultyLevel.ADVANCED,
            language="English",
            price=29.99,
            is_free=False,
            status=CourseStatus.PUBLISHED,
            duration_minutes=300,
            learning_objectives=[
                "Build multi-stage Docker images optimized for production",
                "Deploy and manage stateful and stateless apps on Kubernetes",
                "Automate continuous testing and deployment with GitHub Actions"
            ],
            requirements=["Familiarity with terminal and basic Linux commands"],
            tags=["Docker", "Kubernetes", "DevOps", "CI/CD"]
        )

        db.add_all([course1, course2, course3])
        db.commit()

        # --- Sections & Lessons for Course 1 ---
        sec1_1 = Section(
            course_id=course1.id,
            title="Section 1: Architecture & Backend API Fundamentals",
            description="Setting up the FastAPI project, dependency injection, and data validation.",
            order=0
        )
        sec1_2 = Section(
            course_id=course1.id,
            title="Section 2: Database Modeling & Secure Authentication",
            description="SQLAlchemy relational mappings, password hashing, and JWT tokens.",
            order=1
        )
        sec1_3 = Section(
            course_id=course1.id,
            title="Section 3: React Frontend & Production Deployment",
            description="Connecting React clients, state management, and containerized deployment.",
            order=2
        )
        db.add_all([sec1_1, sec1_2, sec1_3])
        db.commit()

        # Lessons in Section 1.1
        les1_1_1 = Lesson(
            section_id=sec1_1.id,
            title="1.1 Introduction to FastAPI & Modern Web Architecture",
            description="Overview of asynchronous Python, ASGI servers, and API schema design.",
            lesson_type=LessonType.VIDEO,
            content="FastAPI is a modern, high-performance web framework for building APIs with Python 3.8+ based on standard Python type hints.",
            video_url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            duration_seconds=580,
            is_preview=True,
            order=0
        )
        les1_1_2 = Lesson(
            section_id=sec1_1.id,
            title="1.2 Pydantic v2 Models & Request Validation",
            description="Comprehensive guide to input validation, schemas, and error serialization.",
            lesson_type=LessonType.TEXT,
            content="""# Pydantic v2 Deep Dive

Pydantic provides runtime validation and automatic serialization with extreme speed thanks to its Rust core (`pydantic-core`).

### Defining Schemas
```python
from pydantic import BaseModel, EmailStr, Field

class UserCreate(BaseModel):
    name: str = Field(..., min_length=2)
    email: EmailStr
    password: str = Field(..., min_length=8)
```
""",
            duration_seconds=300,
            is_preview=False,
            order=1
        )
        les1_1_3 = Lesson(
            section_id=sec1_1.id,
            title="1.3 Knowledge Check: FastAPI Core Concepts",
            description="Test your understanding of asynchronous routes and dependency injection.",
            lesson_type=LessonType.QUIZ,
            order=2
        )

        # Lessons in Section 1.2
        les1_2_1 = Lesson(
            section_id=sec1_2.id,
            title="2.1 Relational Data Modeling with SQLAlchemy 2.0",
            description="Declarative ORM models, relationships, cascading deletions, and indexes.",
            lesson_type=LessonType.VIDEO,
            video_url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            duration_seconds=640,
            is_preview=False,
            order=0
        )
        les1_2_2 = Lesson(
            section_id=sec1_2.id,
            title="2.2 Capstone Assignment: Implement a Secure Auth Service",
            description="Practical project implementing authentication middleware and password hashing.",
            lesson_type=LessonType.ASSIGNMENT,
            order=1
        )

        # Lessons in Section 1.3
        les1_3_1 = Lesson(
            section_id=sec1_3.id,
            title="3.1 React 18 State Management & API Integration",
            description="Building custom hooks, handling loading and error states, and optimizing rendering.",
            lesson_type=LessonType.VIDEO,
            video_url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            duration_seconds=720,
            is_preview=False,
            order=0
        )

        db.add_all([les1_1_1, les1_1_2, les1_1_3, les1_2_1, les1_2_2, les1_3_1])
        db.commit()

        # Add Quiz for Lesson 1.1.3
        quiz1 = Quiz(
            course_id=course1.id,
            lesson_id=les1_1_3.id,
            title="FastAPI & Async Fundamentals Quiz",
            description="Assess your knowledge on asynchronous programming, Pydantic schemas, and FastAPI dependencies.",
            instructions="Answer all questions carefully. Passing score is 70%. You have up to 3 attempts.",
            time_limit_minutes=15,
            passing_score=70.0,
            max_attempts=3
        )
        db.add(quiz1)
        db.commit()

        q1 = Question(
            quiz_id=quiz1.id,
            question_text="Which Python standard library type hint feature enables FastAPI to automatically validate request bodies?",
            question_type=QuestionType.SINGLE_CHOICE,
            options=[
                {"id": "a", "text": "Type annotations with Pydantic models"},
                {"id": "b", "text": "Decorators alone"},
                {"id": "c", "text": "Raw dictionary parsing"},
                {"id": "d", "text": "RegEx filters"}
            ],
            correct_answers=["a"],
            explanation="FastAPI uses standard Python type hints combined with Pydantic to perform automatic input validation and generate OpenAPI documentation.",
            marks=2.0,
            order=0
        )
        q2 = Question(
            quiz_id=quiz1.id,
            question_text="True or False: Asynchronous route handlers (`async def`) in FastAPI allow the server to handle concurrent I/O operations without blocking worker threads.",
            question_type=QuestionType.TRUE_FALSE,
            options=[
                {"id": "true", "text": "True"},
                {"id": "false", "text": "False"}
            ],
            correct_answers=["true"],
            explanation="`async def` endpoints yield execution to the asyncio event loop while waiting for non-blocking I/O.",
            marks=2.0,
            order=1
        )
        q3 = Question(
            quiz_id=quiz1.id,
            question_text="Which of the following HTTP status codes should be returned when a resource is successfully created?",
            question_type=QuestionType.SINGLE_CHOICE,
            options=[
                {"id": "a", "text": "200 OK"},
                {"id": "b", "text": "201 Created"},
                {"id": "c", "text": "204 No Content"},
                {"id": "d", "text": "301 Moved Permanently"}
            ],
            correct_answers=["b"],
            explanation="HTTP 201 Created signifies that the request succeeded and a new resource has been created.",
            marks=1.0,
            order=2
        )
        db.add_all([q1, q2, q3])
        db.commit()

        # Add Assignment for Lesson 1.2.2
        assign1 = Assignment(
            course_id=course1.id,
            lesson_id=les1_2_2.id,
            title="Design & Implement RBAC Token Verification Middleware",
            description="Write a clean Python module that parses Bearer tokens, queries user role permissions from the database, and enforces role access boundaries.",
            instructions="Submit your implementation code or a link to your repository along with a brief explanation of how you handle token expiration and revocation.",
            deadline=datetime.utcnow() + timedelta(days=14),
            max_marks=100.0
        )
        db.add(assign1)
        db.commit()

        print("🎓 Enrolling students & generating sample progress, quiz attempts, and assignments...")
        # 6. Student 1 Enrollments & Activity
        enrollment1 = Enrollment(
            user_id=student1.id,
            course_id=course1.id,
            status="active",
            progress_percentage=66.7,
            enrolled_at=datetime.utcnow() - timedelta(days=5),
            last_accessed_at=datetime.utcnow(),
            last_lesson_id=les1_2_1.id
        )
        db.add(enrollment1)
        db.commit()

        # Progress for lessons
        prog1 = LessonProgress(user_id=student1.id, lesson_id=les1_1_1.id, course_id=course1.id, is_completed=True, last_position_seconds=580, completed_at=datetime.utcnow() - timedelta(days=4))
        prog2 = LessonProgress(user_id=student1.id, lesson_id=les1_1_2.id, course_id=course1.id, is_completed=True, last_position_seconds=300, completed_at=datetime.utcnow() - timedelta(days=3))
        prog3 = LessonProgress(user_id=student1.id, lesson_id=les1_1_3.id, course_id=course1.id, is_completed=True, completed_at=datetime.utcnow() - timedelta(days=2))
        prog4 = LessonProgress(user_id=student1.id, lesson_id=les1_2_1.id, course_id=course1.id, is_completed=True, last_position_seconds=640, completed_at=datetime.utcnow() - timedelta(days=1))
        db.add_all([prog1, prog2, prog3, prog4])
        db.commit()

        # Student 1 Quiz Attempt
        attempt1 = QuizAttempt(
            quiz_id=quiz1.id,
            user_id=student1.id,
            score=5.0,
            max_score=5.0,
            percentage=100.0,
            is_passed=True,
            attempt_number=1,
            started_at=datetime.utcnow() - timedelta(days=2),
            completed_at=datetime.utcnow() - timedelta(days=2)
        )
        db.add(attempt1)
        db.commit()

        ans1 = QuizAnswer(attempt_id=attempt1.id, question_id=q1.id, user_answer="a", is_correct=True, marks_awarded=2.0)
        ans2 = QuizAnswer(attempt_id=attempt1.id, question_id=q2.id, user_answer="true", is_correct=True, marks_awarded=2.0)
        ans3 = QuizAnswer(attempt_id=attempt1.id, question_id=q3.id, user_answer="b", is_correct=True, marks_awarded=1.0)
        db.add_all([ans1, ans2, ans3])
        db.commit()

        # Student 1 Assignment Submission
        sub1 = AssignmentSubmission(
            assignment_id=assign1.id,
            user_id=student1.id,
            submission_text="Implemented custom OAuth2 Bearer scheme with role verification decorator in FastAPI using SQLAlchemy session context.",
            submitted_at=datetime.utcnow() - timedelta(days=1),
            grade=95.0,
            feedback="Outstanding work! Clean separation of security dependencies and proper HTTP 403 handling.",
            graded_by=instructor1.id,
            graded_at=datetime.utcnow() - timedelta(hours=6),
            status=SubmissionStatus.GRADED
        )
        db.add(sub1)
        db.commit()

        # Student 1 enrolled in Course 2 with 100% completion & Certificate
        # Add basic section and lesson for Course 2
        sec2_1 = Section(course_id=course2.id, title="Module 1: Machine Learning Foundations", order=0)
        db.add(sec2_1)
        db.commit()
        les2_1_1 = Lesson(
            section_id=sec2_1.id,
            title="1.1 Python for Scientific Computing & Matrix Operations",
            lesson_type=LessonType.VIDEO,
            video_url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            duration_seconds=420,
            is_preview=True,
            order=0
        )
        db.add(les2_1_1)
        db.commit()

        enrollment2 = Enrollment(
            user_id=student1.id,
            course_id=course2.id,
            status="completed",
            progress_percentage=100.0,
            enrolled_at=datetime.utcnow() - timedelta(days=10),
            completed_at=datetime.utcnow() - timedelta(days=1),
            last_accessed_at=datetime.utcnow() - timedelta(days=1),
            last_lesson_id=les2_1_1.id
        )
        prog_c2 = LessonProgress(user_id=student1.id, lesson_id=les2_1_1.id, course_id=course2.id, is_completed=True, last_position_seconds=420, completed_at=datetime.utcnow() - timedelta(days=1))
        db.add_all([enrollment2, prog_c2])
        db.commit()

        cert1 = Certificate(
            certificate_code="CERT-8F3A-92D1",
            user_id=student1.id,
            course_id=course2.id,
            issued_at=datetime.utcnow() - timedelta(days=1),
            student_name=student1.name,
            course_name=course2.title,
            instructor_name=instructor2.name,
            verification_url="/verify-certificate/CERT-8F3A-92D1"
        )
        db.add(cert1)
        db.commit()

        # Announcements & Notifications
        ann1 = Announcement(
            course_id=course1.id,
            author_id=instructor1.id,
            title="📢 Welcome to Full-Stack React & FastAPI Mastery!",
            content="Welcome everyone! Live Q&A sessions are held every Friday. Check out Section 1 to get your development environment configured.",
            is_pinned=True,
            created_at=datetime.utcnow() - timedelta(days=4)
        )
        db.add(ann1)

        notif1 = Notification(
            user_id=student1.id,
            title="Assignment Graded",
            message="Your submission for 'Design & Implement RBAC Token Verification Middleware' was graded: 95/100 points.",
            notification_type="grade",
            link_url=f"/learn/{course1.id}?lesson={les1_2_2.id}",
            is_read=False
        )
        notif2 = Notification(
            user_id=student1.id,
            title="🎉 Certificate Issued!",
            message=f"Congratulations! You completed '{course2.title}'. Your certificate is available.",
            notification_type="certificate",
            link_url="/verify-certificate/CERT-8F3A-92D1",
            is_read=True
        )
        db.add_all([notif1, notif2])

        # Audit Logs
        log1 = AuditLog(
            user_id=superadmin.id,
            action="SYSTEM_INIT",
            target_type="system",
            target_id="1",
            details={"message": "Modern LMS system initialization and schema seeding complete."}
        )
        db.add(log1)
        db.commit()

        print("✅ Database seeding completed successfully!")
        print("\n🔑 DEMO ACCOUNTS READY:")
        print("  Super Admin : admin@lms.com / Admin@123456")
        print("  Instructor  : sarah.instructor@lms.com / Instructor@123")
        print("  Instructor  : alex.dev@lms.com / Instructor@123")
        print("  Student     : emma.student@lms.com / Student@123")
        print("  Student     : michael.student@lms.com / Student@123")
        print("  Sample Cert : CERT-8F3A-92D1")

    finally:
        db.close()


def seed_if_empty():
    """Seeds the database only if no users exist (safe for automatic server startup)."""
    db = SessionLocal()
    try:
        user_count = db.query(User).count()
        if user_count == 0:
            print("⚡ Database is empty. Running auto-seeding...")
            seed_database()
        else:
            print(f"✅ Database already initialized ({user_count} users found).")
    except Exception as e:
        print(f"⚠️ Auto-seed check encountered error: {e}")
        try:
            seed_database()
        except Exception as inner_e:
            print(f"❌ Auto-seed failed: {inner_e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()

