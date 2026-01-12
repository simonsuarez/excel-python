from fastapi import FastAPI, Depends
from db.conexionBD import get_db
from sqlalchemy.orm import Session
from sqlalchemy import text

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}

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