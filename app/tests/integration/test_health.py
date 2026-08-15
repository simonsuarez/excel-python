import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

@pytest.mark.integration
def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}