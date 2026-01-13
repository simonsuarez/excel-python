from fastapi import APIRouter, Depends, UploadFile, File
from db.conexionBD import get_db
from sqlalchemy.orm import Session
from services.user_service import crear_usuario_desde_excel, comprobar_conexion_db

router = APIRouter()

# Test database connection
@router.get("/select_db")
def select_db(db: Session = Depends(get_db)):
    return comprobar_conexion_db(db)
    
    
# Endpoint para cargar datos desde un archivo Excel
@router.post("/cargar_excel")
def cargar_datos_excel(path: UploadFile = File(...), db: Session = Depends(get_db)):
    return crear_usuario_desde_excel(path, db)
