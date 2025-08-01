from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models.project import Project
from ..models.permission import ProjectPermission
from ..schemas.project import ProjectCreate, ProjectUpdate, Project as ProjectSchema, ProjectList
from ..dependencies import get_current_active_user
from ..models.user import User

router = APIRouter(tags=["projects"])

@router.post("/", response_model=ProjectSchema)
async def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a new project"""
    db_project = Project(
        name=project.name,
        description=project.description,
        tags=project.tags,
        owner_id=current_user.id
    )
    
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    
    return db_project

@router.get("/", response_model=ProjectList)
async def get_projects(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get user's projects"""
    # Get projects owned by user
    owned_projects = db.query(Project).filter(
        Project.owner_id == current_user.id,
        Project.status == "active"
    ).offset(skip).limit(limit).all()
    
    # Get projects where user has permissions
    permission_projects = db.query(Project).join(ProjectPermission).filter(
        ProjectPermission.user_id == current_user.id,
        Project.status == "active"
    ).offset(skip).limit(limit).all()
    
    # Combine and remove duplicates
    all_projects = list(set(owned_projects + permission_projects))
    total = len(all_projects)
    
    return ProjectList(projects=all_projects, total=total)

@router.get("/{project_id}", response_model=ProjectSchema)
async def get_project(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get a specific project"""
    project = db.query(Project).filter(Project.id == project_id).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Check if user has access
    if project.owner_id != current_user.id:
        permission = db.query(ProjectPermission).filter(
            ProjectPermission.project_id == project_id,
            ProjectPermission.user_id == current_user.id
        ).first()
        
        if not permission:
            raise HTTPException(status_code=403, detail="Access denied")
    
    return project

@router.put("/{project_id}", response_model=ProjectSchema)
async def update_project(
    project_id: str,
    project_update: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update a project"""
    project = db.query(Project).filter(Project.id == project_id).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Check if user is owner or has edit permission
    if project.owner_id != current_user.id:
        permission = db.query(ProjectPermission).filter(
            ProjectPermission.project_id == project_id,
            ProjectPermission.user_id == current_user.id,
            ProjectPermission.can_edit == True
        ).first()
        
        if not permission:
            raise HTTPException(status_code=403, detail="Access denied")
    
    # Update project fields
    for field, value in project_update.dict(exclude_unset=True).items():
        setattr(project, field, value)
    
    db.commit()
    db.refresh(project)
    
    return project

@router.delete("/{project_id}")
async def delete_project(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Delete a project"""
    project = db.query(Project).filter(Project.id == project_id).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Only owner can delete project
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only project owner can delete project")
    
    db.delete(project)
    db.commit()
    
    return {"message": "Project deleted successfully"} 