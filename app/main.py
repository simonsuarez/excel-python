from fastapi import FastAPI
from controllers.user_controller import router as user_router

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}

app.include_router(user_router, prefix="/users", tags=["users"])


