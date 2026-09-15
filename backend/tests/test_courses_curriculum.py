def test_course_crud_and_curriculum(client, instructor_auth_headers, student_auth_headers):
    # 1. Instructor creates course
    course_payload = {
        "title": "React and FastAPI Testing Course",
        "short_description": "Testing course short description",
        "full_description": "Full testing course details",
        "difficulty_level": "beginner",
        "price": 0.0,
        "is_free": True,
        "status": "published"
    }
    create_res = client.post("/api/v1/courses", json=course_payload, headers=instructor_auth_headers)
    assert create_res.status_code == 201
    course_data = create_res.json()
    course_id = course_data["id"]
    assert course_data["title"] == "React and FastAPI Testing Course"

    # 2. Add section
    sec_payload = {
        "title": "Section 1: Introduction",
        "order": 0
    }
    sec_res = client.post(f"/api/v1/sections/course/{course_id}", json=sec_payload, headers=instructor_auth_headers)
    assert sec_res.status_code == 201
    section_id = sec_res.json()["id"]

    # 3. Add lesson
    lesson_payload = {
        "title": "Lesson 1: Hello World",
        "lesson_type": "text",
        "content": "Welcome to testing!",
        "is_preview": True,
        "order": 0
    }
    les_res = client.post(f"/api/v1/lessons/section/{section_id}", json=lesson_payload, headers=instructor_auth_headers)
    assert les_res.status_code == 201
    lesson_id = les_res.json()["id"]

    # 4. Student can view course list & course detail
    courses_res = client.get("/api/v1/courses")
    assert courses_res.status_code == 200
    assert any(c["id"] == course_id for c in courses_res.json())

    detail_res = client.get(f"/api/v1/courses/{course_id}")
    assert detail_res.status_code == 200
    assert len(detail_res.json()["sections"]) >= 1
