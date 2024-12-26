from fastapi import APIRouter
from app.api.routes import books
from app.api.routes import loans
from app.api.routes import actions

api_router = APIRouter()
api_router.include_router(books.router)
api_router.include_router(loans.router)
api_router.include_router(actions.router)
