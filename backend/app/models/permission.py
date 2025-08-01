from sqlalchemy import Column, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base
import uuid

class ProjectPermission(Base):
    __tablename__ = "project_permissions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    can_edit = Column(Boolean, default=False)
    can_delete = Column(Boolean, default=False)
    can_share = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="project_permissions")
    project = relationship("Project", back_populates="permissions") 