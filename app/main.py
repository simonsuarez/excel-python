from fastapi import FastAPI, Depends, UploadFile, File
from db.conexionBD import get_db
from sqlalchemy.orm import Session
from sqlalchemy import text
import pandas as pd
from models.user import Usuario

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}

# Test database connection
@app.get("/select_db")
def select_db(db: Session = Depends(get_db)):
    try:
        resultado = db.execute(text("SELECT 1")).scalar()
        # return {"status": "ok bd"} if resultado == 1 else {"status": "error"}
        if resultado == 1:
            return {"status": "ok bd"} 
        else:
            return {"status": "error"}
    except Exception as e:
        return {"status": "error", "detail": str(e)}
    
# Endpoint para cargar datos desde un archivo Excel
@app.post("/cargar_excel")
def cargar_datos_excel(path: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        df = pd.read_excel(path.file)

        for _, row in df.iterrows():
            usuario = Usuario(
                name=row["name"],
                last_name=row.get("last_name"),
                age=row["age"],
                email=row["email"]
            )
            db.add(usuario)

        db.commit()
        return {"inserted_records": len(df)}
    except Exception as e:
        db.rollback()
        return {"status": "error", "detail": str(e)}