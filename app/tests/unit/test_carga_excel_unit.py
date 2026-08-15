from unittest.mock import MagicMock, patch

import pandas as pd
import pytest

from services.user_service import crear_usuario_desde_excel


@pytest.mark.unit
def test_crear_usuario_desde_excel_contadores():
    # DataFrame simulado
    df_mock = pd.DataFrame([
        {"name": "Juan", "last_name": "Perez", "age": 17, "email": "juan@test.com"},          # menor edad
        {"name": "Ana", "last_name": "Diaz", "age": 25, "email": "correo_invalido"},          # email inválido
        {"name": "Luis", "last_name": "Lopez", "age": 30, "email": "luis@test.com"},          # duplicado
        {"name": "Maria", "last_name": "Rios", "age": 22, "email": "maria@test.com"}          # válido
    ])

    # Mock path (UploadFile)
    path = MagicMock()
    path.file = MagicMock()

    # Mock DB
    db = MagicMock()

    # db.execute
    db.execute.side_effect = [
        MagicMock(scalar_one_or_none=lambda: object()), # Luis (duplicado)
        MagicMock(scalar_one_or_none=lambda: None),     # Maria
    ]

    with patch("services.user_service.pd.read_excel", return_value=df_mock):
        result = crear_usuario_desde_excel(path, db)

    assert result["inserted_records"] == 1
    assert result["duplicated_records"] == 1
    assert result["underage_records"] == 1
    assert result["invalid_email_records"] == 1
    assert result["all_records"] == 4

    db.add.assert_called_once()
    db.commit.assert_called_once()