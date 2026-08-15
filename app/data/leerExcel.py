import pandas as pd
from db.conexionBD import SessionLocal
from sqlalchemy.orm import Session

from app.models.user_model import Usuario


def cargar_excel(path: str):
    db: Session = SessionLocal()
    try:
        df = pd.read_excel(path)

        for _, row in df.iterrows():
            usuario = Usuario(
                name=row["name"],
                last_name=row.get("last_name"),
                age=row["age"],
                email=row["email"]
            )
            db.add(usuario)

        db.commit()
        print(f"Insertados {len(df)} registros")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    cargar_excel("/app/data/usuarios.xlsx")