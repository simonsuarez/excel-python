# Asegura que los modelos se importen para crear las tablas
import models.user_model  # noqa: F401
from db.base import Base
from db.conexionBD import engine

Base.metadata.create_all(bind=engine)
