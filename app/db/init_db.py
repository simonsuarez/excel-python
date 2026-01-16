from db.base import Base
from db.conexionBD import engine

Base.metadata.create_all(bind=engine)
