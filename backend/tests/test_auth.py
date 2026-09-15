def test_register_and_login(client):
    # 1. Register new student
    register_payload = {
        "name": "Jane Doe",
        "email": "jane.doe@example.com",
        "password": "Password123!",
        "role": "student"
    }
    response = client.post("/api/v1/auth/register", json=register_payload)
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "jane.doe@example.com"
    assert data["user"]["role"] == "student"

    # 2. Login
    login_payload = {
        "email": "jane.doe@example.com",
        "password": "Password123!"
    }
    login_res = client.post("/api/v1/auth/login", json=login_payload)
    assert login_res.status_code == 200
    login_data = login_res.json()
    assert "access_token" in login_data

    # 3. Get /me
    token = login_data["access_token"]
    me_res = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["name"] == "Jane Doe"


def test_invalid_login(client):
    response = client.post("/api/v1/auth/login", json={"email": "wrong@lms.com", "password": "WrongPassword"})
    assert response.status_code == 401
