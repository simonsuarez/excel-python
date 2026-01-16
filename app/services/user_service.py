from sqlalchemy import select, text
import pandas as pd
from models.user_model import Usuario
import re

EMAIL_REGEX = r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"

def email_valido(email: str) -> bool:
    return re.match(EMAIL_REGEX, email) is not None


def comprobar_conexion_db(db):
    try:
        resultado = db.execute(text("SELECT 1")).scalar()
        # return {"status": "ok bd"} if resultado == 1 else {"status": "error"}
        if resultado == 1:
            return {"databases": resultado} 
        else:
            return {"databases": "error"}
    except Exception as e:
        return {"databases": "error", "detail": str(e)}

def crear_usuario_desde_excel(path, db):
    try:
        df = pd.read_excel(path.file)
        contadorDuplicados = 0
        contadorInsertados = 0
        contadorMenorEdad = 0
        contadorEmailInvalido = 0

        for _, row in df.iterrows():
            if row["age"] < 18:
                contadorMenorEdad += 1
                continue  # saltar si el usuario es menor de edad

            email = row["email"]
            if not email_valido(email):
                contadorEmailInvalido += 1
                continue  # saltar si el email no es válido

            #validar si el email ya existe
            #existing_user = db.query(Usuario).filter(Usuario.email == row["email"]).first()
            usuario_existente = db.execute(select(Usuario).where(Usuario.email == row["email"])).scalar_one_or_none()
            if usuario_existente:
                contadorDuplicados += 1
                continue  # saltar si el usuario ya existe

            
            usuario = Usuario(
                name=row["name"],
                last_name=row.get("last_name"),
                age=row["age"],
                email=row["email"]
            )
            db.add(usuario)
            contadorInsertados += 1

        db.commit()
        return {"inserted_records": contadorInsertados
                , "duplicated_records": contadorDuplicados
                , "underage_records": contadorMenorEdad
                , "invalid_email_records": contadorEmailInvalido
                , "all_records": len(df)}
    except Exception as e:
        db.rollback()
        return {"status": "error", "detail": str(e)}