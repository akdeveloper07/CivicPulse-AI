import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.base import Base
from app.db.session import engine


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)


def test_health_check():
    with TestClient(app) as client:
        response = client.get("/api/v1/health")
        assert response.status_code == 200
        assert response.json()["status"] == "ok"


def test_user_registration_and_login():
    with TestClient(app) as client:
        reg_data = {
            "name": "Test Citizen",
            "email": "testcitizen_unique@civicpulse.org",
            "password": "Password123!",
            "role": "citizen"
        }
        # Register
        res = client.post("/api/v1/auth/register", json=reg_data)
        assert res.status_code in [201, 400]  # 201 created or 400 if existing

        # Login
        login_data = {
            "email": "testcitizen_unique@civicpulse.org",
            "password": "Password123!"
        }
        res_login = client.post("/api/v1/auth/login", json=login_data)
        assert res_login.status_code == 200
        json_data = res_login.json()
        assert "access_token" in json_data
        assert json_data["user"]["email"] == "testcitizen_unique@civicpulse.org"
