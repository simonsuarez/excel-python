from db.base import Base
from db.conexionBD import engine
import models.user_model  # Asegura que los modelos se importen para crear las tablas

Base.metadata.create_all(bind=engine)
