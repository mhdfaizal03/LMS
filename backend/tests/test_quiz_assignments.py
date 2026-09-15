def test_quiz_and_assignment_workflow(client, instructor_auth_headers, student_auth_headers):
    # 1. Instructor creates course
    course_res = client.post("/api/v1/courses", json={
        "title": "Interactive Quizzes Course",
        "short_description": "Learn quiz taking",
        "is_free": True,
        "status": "published"
    }, headers=instructor_auth_headers)
    course_id = course_res.json()["id"]

    # 2. Add quiz with questions
    quiz_res = client.post(f"/api/v1/quizzes/course/{course_id}", json={
        "title": "Module 1 Assessment",
        "description": "Short test",
        "passing_score": 50.0,
        "time_limit_minutes": 10,
        "max_attempts": 2
    }, headers=instructor_auth_headers)
    assert quiz_res.status_code == 201
    quiz_id = quiz_res.json()["id"]

    q_res = client.post(f"/api/v1/quizzes/{quiz_id}/questions", json={
        "question_text": "Is Python interpreted?",
        "question_type": "true_false",
        "options": [{"id": "true", "text": "True"}, {"id": "false", "text": "False"}],
        "correct_answers": ["true"],
        "marks": 10.0
    }, headers=instructor_auth_headers)
    assert q_res.status_code == 201
    q_id = q_res.json()["id"]

    # 3. Student takes quiz and passes
    submit_res = client.post(f"/api/v1/quizzes/{quiz_id}/submit", json={
        "answers": [{"question_id": q_id, "user_answer": "true"}]
    }, headers=student_auth_headers)
    assert submit_res.status_code == 200
    attempt_data = submit_res.json()
    assert attempt_data["percentage"] == 100.0
    assert attempt_data["is_passed"] is True

    # 4. Create assignment and submit
    assign_res = client.post(f"/api/v1/assignments/course/{course_id}", json={
        "title": "Build a Simple API",
        "description": "Submit repo code",
        "max_marks": 100.0
    }, headers=instructor_auth_headers)
    assert assign_res.status_code == 201
    assign_id = assign_res.json()["id"]

    # Student submits assignment
    sub_res = client.post(f"/api/v1/assignments/{assign_id}/submit", json={
        "submission_text": "https://github.com/student/simple-api"
    }, headers=student_auth_headers)
    assert sub_res.status_code == 200
    sub_id = sub_res.json()["id"]

    # Instructor grades assignment
    grade_res = client.post(f"/api/v1/assignments/submissions/{sub_id}/grade", json={
        "grade": 98.0,
        "feedback": "Excellent structure and clean code!"
    }, headers=instructor_auth_headers)
    assert grade_res.status_code == 200
    assert grade_res.json()["grade"] == 98.0
    assert grade_res.json()["status"] == "graded"
