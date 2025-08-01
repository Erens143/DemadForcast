from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routes import auth_router, projects_router, datasets_router

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="DeFo API",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(projects_router, prefix="/projects", tags=["Projects"])
app.include_router(datasets_router, tags=["Datasets"])

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "DeFo API is running!"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"} 