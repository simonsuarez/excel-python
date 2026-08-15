from typing import Annotated

from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from db.conexionBD import get_db
from services.user_service import comprobar_conexion_db, crear_usuario_desde_excel

router = APIRouter()

# Test database connection
@router.get("/select_db")
def select_db(db: Annotated[Session, Depends(get_db)]):
    return comprobar_conexion_db(db)
    
    
# Endpoint para cargar datos desde un archivo Excel
@router.post("/cargar_excel")
def cargar_datos_excel(path: Annotated[UploadFile, File(...)], db: Annotated[Session, Depends(get_db)]):
    return crear_usuario_desde_excel(path, db)
