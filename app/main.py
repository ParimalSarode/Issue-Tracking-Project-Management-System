from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
import os

from .database import engine
from . import models
from .routers import users, projects, issues

# Initialize database tables automatically on startup
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Issue Tracking System")

# Configure CORS so the frontend can securely call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers with an /api/v1 prefix to keep data endpoints separate from UI routes
app.include_router(users.router, prefix="/api/v1")
app.include_router(projects.router, prefix="/api/v1")
app.include_router(issues.router, prefix="/api/v1")

# Create directories for UI assets if they do not exist yet
os.makedirs("app/static", exist_ok=True)
os.makedirs("app/templates", exist_ok=True)

# Mount static files (CSS, JS) and setup Jinja2 for HTML templates
app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")

# UI Entry Route
@app.get("/", response_class=HTMLResponse, include_in_schema=False)
def serve_dashboard(request: Request):
    """Serves the main frontend Single Page Application (SPA)."""
    return templates.TemplateResponse("index.html", {"request": request})