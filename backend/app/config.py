import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "sqlite:///./defo.db"
    
    # JWT
    SECRET_KEY: str = "your-secret-key-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    # File Upload
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE: int = 50 * 1024 * 1024  # 50MB
    
    # CORS
    CORS_ORIGINS: list = ["http://localhost:3000"]
    
    class Config:
        env_file = ".env"

settings = Settings()

# Create uploads directory if it doesn't exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True) 