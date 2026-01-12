from db.base import Base
from db.conexionBD import engine
from models.user import Usuario

Base.metadata.create_all(bind=engine)
