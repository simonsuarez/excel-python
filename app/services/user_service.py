from sqlalchemy import select, text
import pandas as pd
from models.user_model import Usuario

def comprobar_conexion_db(db):
    try:
        resultado = db.execute(text("SELECT 1")).scalar()
        # return {"status": "ok bd"} if resultado == 1 else {"status": "error"}
        if resultado == 1:
            return {"status": "ok bd"} 
        else:
            return {"status": "error"}
    except Exception as e:
        return {"status": "error", "detail": str(e)}

def crear_usuario_desde_excel(path, db):
    try:
        df = pd.read_excel(path.file)

        for _, row in df.iterrows():
            #validar si el email ya existe
            #existing_user = db.query(Usuario).filter(Usuario.email == row["email"]).first()
            usuario_existente = db.execute(select(Usuario).where(Usuario.email == row["email"])).scalar_one_or_none()
            if usuario_existente:
                continue  # saltar si el usuario ya existe

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