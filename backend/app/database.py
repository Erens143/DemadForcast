from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# Database URL - SQLite cho development
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./defo.db")

# Tạo engine
engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)

# Tạo SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Tạo Base class
Base = declarative_base()

# Dependency để lấy database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 