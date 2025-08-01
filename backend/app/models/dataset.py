from sqlalchemy import Column, String, DateTime, ForeignKey, Integer
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base
import uuid

class Dataset(Base):
    __tablename__ = "datasets"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    name = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_size = Column(Integer)  # Size in bytes
    file_type = Column(String)  # csv, excel, etc.
    row_count = Column(Integer)  # Number of rows
    column_count = Column(Integer)  # Number of columns
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    project = relationship("Project", back_populates="datasets") 