from fastapi.testclient import TestClient
from main import app

client = TestClient(app)
def test_select_db():
    response = client.get("/users/select_db")
    assert response.status_code == 200
    assert "databases" in response.json()