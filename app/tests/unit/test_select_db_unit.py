# tests/unit/test_comprobar_conexion_db.py
from unittest.mock import MagicMock

import pytest
from services.user_service import comprobar_conexion_db
from sqlalchemy.exc import SQLAlchemyError


@pytest.mark.unit
def test_comprobar_conexion_db_ok():
    db = MagicMock()
    db.execute.return_value.scalar.return_value = 1

    result = comprobar_conexion_db(db)

    assert result == {"databases": 1}

@pytest.mark.unit
def test_comprobar_conexion_db_error():
    db = MagicMock()
    db.execute.side_effect = SQLAlchemyError("DB down")

    result = comprobar_conexion_db(db)

    assert result["databases"] == "error"