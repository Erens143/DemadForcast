from sqlalchemy import Column, String, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base
import uuid

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    description = Column(Text)
    owner_id = Column(String, ForeignKey("users.id"), nullable=False)
    status = Column(String, default="active")  # active, archived, deleted
    tags = Column(String)  # JSON string of tags
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    owner = relationship("User", back_populates="projects")
    datasets = relationship("Dataset", back_populates="project", cascade="all, delete-orphan")
    permissions = relationship("ProjectPermission", back_populates="project", cascade="all, delete-orphan") 