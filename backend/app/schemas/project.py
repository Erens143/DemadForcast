from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    tags: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    tags: Optional[str] = None

class Project(ProjectBase):
    id: str
    owner_id: str
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ProjectList(BaseModel):
    projects: List[Project]
    total: int 