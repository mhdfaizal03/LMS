def test_enrollment_progress_and_certificate(client, instructor_auth_headers, student_auth_headers):
    # 1. Instructor creates course with 1 section and 1 lesson
    course_res = client.post("/api/v1/courses", json={
        "title": "Fast Certificate Course",
        "is_free": True,
        "status": "published"
    }, headers=instructor_auth_headers)
    course_id = course_res.json()["id"]

    sec_res = client.post(f"/api/v1/sections/course/{course_id}", json={"title": "Section 1"}, headers=instructor_auth_headers)
    section_id = sec_res.json()["id"]

    les_res = client.post(f"/api/v1/lessons/section/{section_id}", json={"title": "Single Lesson", "lesson_type": "text"}, headers=instructor_auth_headers)
    lesson_id = les_res.json()["id"]

    # 2. Student enrolls
    enroll_res = client.post(f"/api/v1/enrollments/course/{course_id}", headers=student_auth_headers)
    assert enroll_res.status_code == 201
    assert enroll_res.json()["progress_percentage"] == 0.0

    # 3. Complete lesson
    prog_res = client.post(f"/api/v1/progress/lesson/{lesson_id}", json={"is_completed": True, "last_position_seconds": 60}, headers=student_auth_headers)
    assert prog_res.status_code == 200
    assert prog_res.json()["is_completed"] is True

    # 4. Check progress summary & certificate issuance
    sum_res = client.get(f"/api/v1/progress/course/{course_id}", headers=student_auth_headers)
    assert sum_res.status_code == 200
    summary = sum_res.json()
    assert summary["progress_percentage"] == 100.0
    assert summary["is_completed"] is True
    assert summary["certificate_id"] is not None

    # 5. Verify certificate publicly
    cert_code = summary["certificate_id"]
    verify_res = client.get(f"/api/v1/certificates/verify/{cert_code}")
    assert verify_res.status_code == 200
    assert verify_res.json()["is_valid"] is True
