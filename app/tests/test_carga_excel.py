from fastapi.testclient import TestClient
from main import app
import pandas as pd
import tempfile

client = TestClient(app)

def crear_excel_prueba():
    df = pd.DataFrame([
        {"name": "Ana", "last_name": "Perez", "age": 25, "email": "ana@test.com"},
        {"name": "Juan", "last_name": "Lopez", "age": 16, "email": "juan@test.com"},
        {"name": "Pedro", "last_name": "Diaz", "age": 30, "email": "correo_invalido"}
    ])

    tmp = tempfile.NamedTemporaryFile(suffix=".xlsx", delete=False)
    df.to_excel(tmp.name, index=False)
    return tmp.name

def test_cargar_excel():
    excel_path = crear_excel_prueba()

    with open(excel_path, "rb") as f:
        response = client.post(
            "/users/cargar_excel",
            files={"path": ("usuarios.xlsx", f, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}
        )

    assert response.status_code == 200
    assert "inserted_records" in response.json()