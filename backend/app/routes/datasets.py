from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
import pandas as pd
import os
import uuid
from datetime import datetime

from ..database import get_db
from ..dependencies import get_current_user
from ..models.user import User
from ..models.project import Project
from ..models.dataset import Dataset
from ..models.permission import ProjectPermission
from ..schemas.dataset import DatasetCreate, DatasetResponse, DatasetList
from ..config import settings

router = APIRouter()

@router.post("/projects/{project_id}/datasets/upload", response_model=DatasetResponse)
async def upload_dataset(
    project_id: str,
    file: UploadFile = File(...),
    name: str = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Upload dataset file (CSV/Excel)"""
    
    # Check project exists and user has permission
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Check user permission
    permission = db.query(ProjectPermission).filter(
        ProjectPermission.project_id == project_id,
        ProjectPermission.user_id == current_user.id
    ).first()
    
    if not permission and project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="No permission to upload to this project")
    
    # Validate file type
    allowed_extensions = ['.csv', '.xlsx', '.xls']
    file_extension = os.path.splitext(file.filename)[1].lower()
    
    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=400, 
            detail=f"File type not supported. Allowed: {', '.join(allowed_extensions)}"
        )
    
    # Create upload directory if not exists
    upload_dir = os.path.join(settings.UPLOAD_DIR, project_id)
    os.makedirs(upload_dir, exist_ok=True)
    
    # Generate unique filename
    file_id = str(uuid.uuid4())
    file_extension = os.path.splitext(file.filename)[1]
    filename = f"{file_id}{file_extension}"
    file_path = os.path.join(upload_dir, filename)
    
    try:
        # Save file
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Read and validate data
        if file_extension == '.csv':
            df = pd.read_csv(file_path)
        else:
            df = pd.read_excel(file_path)
        
        # Basic validation
        if df.empty:
            raise HTTPException(status_code=400, detail="File is empty")
        
        if len(df.columns) < 2:
            raise HTTPException(status_code=400, detail="File must have at least 2 columns")
        
        # Create dataset record
        dataset = Dataset(
            id=str(uuid.uuid4()),
            project_id=project_id,
            name=name,
            file_path=file_path,
            file_size=len(content),
            file_type=file_extension[1:],  # Remove dot
            row_count=len(df),
            column_count=len(df.columns),
            uploaded_at=datetime.utcnow()
        )
        
        db.add(dataset)
        db.commit()
        db.refresh(dataset)
        
        return DatasetResponse(
            id=dataset.id,
            name=dataset.name,
            file_size=dataset.file_size,
            file_type=dataset.file_type,
            row_count=dataset.row_count,
            column_count=dataset.column_count,
            uploaded_at=dataset.uploaded_at
        )
        
    except Exception as e:
        # Clean up file if error
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=400, detail=f"Error processing file: {str(e)}")

@router.get("/projects/{project_id}/datasets/", response_model=DatasetList)
async def get_project_datasets(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all datasets for a project"""
    
    # Check project exists and user has permission
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Check user permission
    permission = db.query(ProjectPermission).filter(
        ProjectPermission.project_id == project_id,
        ProjectPermission.user_id == current_user.id
    ).first()
    
    if not permission and project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="No permission to view this project")
    
    datasets = db.query(Dataset).filter(Dataset.project_id == project_id).all()
    
    return DatasetList(
        datasets=[
            DatasetResponse(
                id=dataset.id,
                name=dataset.name,
                file_size=dataset.file_size,
                file_type=dataset.file_type,
                row_count=dataset.row_count,
                column_count=dataset.column_count,
                uploaded_at=dataset.uploaded_at
            ) for dataset in datasets
        ]
    )

@router.get("/datasets/{dataset_id}/preview")
async def get_dataset_preview(
    dataset_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get dataset preview (first 5 rows)"""
    
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    # Check user permission for project
    project = db.query(Project).filter(Project.id == dataset.project_id).first()
    permission = db.query(ProjectPermission).filter(
        ProjectPermission.project_id == dataset.project_id,
        ProjectPermission.user_id == current_user.id
    ).first()
    
    if not permission and project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="No permission to view this dataset")
    
    try:
        # Read data
        if dataset.file_type == 'csv':
            df = pd.read_csv(dataset.file_path)
        else:
            df = pd.read_excel(dataset.file_path)
        
        # Get first 5 rows
        preview_data = df.head(5).to_dict('records')
        
        return {
            "columns": df.columns.tolist(),
            "preview": preview_data,
            "total_rows": len(df),
            "total_columns": len(df.columns)
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading dataset: {str(e)}")

@router.get("/datasets/{dataset_id}/analysis")
async def get_dataset_analysis(
    dataset_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get dataset analysis (statistics, charts data)"""
    
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    # Check user permission for project
    project = db.query(Project).filter(Project.id == dataset.project_id).first()
    permission = db.query(ProjectPermission).filter(
        ProjectPermission.project_id == dataset.project_id,
        ProjectPermission.user_id == current_user.id
    ).first()
    
    if not permission and project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="No permission to view this dataset")
    
    try:
        # Read data
        if dataset.file_type == 'csv':
            df = pd.read_csv(dataset.file_path)
        else:
            df = pd.read_excel(dataset.file_path)
        
        # Basic statistics
        stats = {}
        for col in df.columns:
            if df[col].dtype in ['int64', 'float64']:
                stats[col] = {
                    "min": float(df[col].min()),
                    "max": float(df[col].max()),
                    "mean": float(df[col].mean()),
                    "std": float(df[col].std()),
                    "count": int(df[col].count())
                }
            else:
                stats[col] = {
                    "unique_count": int(df[col].nunique()),
                    "most_common": df[col].value_counts().head(5).to_dict()
                }
        
        # Time series analysis (if date column exists)
        time_series_data = None
        date_columns = []
        for col in df.columns:
            if 'date' in col.lower() or 'time' in col.lower():
                date_columns.append(col)
        
        if date_columns:
            # Use first date column for time series
            date_col = date_columns[0]
            try:
                df[date_col] = pd.to_datetime(df[date_col])
                time_series_data = df.sort_values(date_col).to_dict('records')
            except:
                pass
        
        return {
            "dataset_id": dataset_id,
            "columns": df.columns.tolist(),
            "statistics": stats,
            "time_series_data": time_series_data,
            "total_rows": len(df),
            "total_columns": len(df.columns)
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error analyzing dataset: {str(e)}")

@router.delete("/datasets/{dataset_id}")
async def delete_dataset(
    dataset_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete dataset"""
    
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    # Check user permission for project
    project = db.query(Project).filter(Project.id == dataset.project_id).first()
    permission = db.query(ProjectPermission).filter(
        ProjectPermission.project_id == dataset.project_id,
        ProjectPermission.user_id == current_user.id
    ).first()
    
    if not permission and project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="No permission to delete this dataset")
    
    try:
        # Delete file
        if os.path.exists(dataset.file_path):
            os.remove(dataset.file_path)
        
        # Delete from database
        db.delete(dataset)
        db.commit()
        
        return {"message": "Dataset deleted successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error deleting dataset: {str(e)}") 