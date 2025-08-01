from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class DatasetBase(BaseModel):
    name: str

class DatasetCreate(DatasetBase):
    project_id: str

class DatasetResponse(BaseModel):
    id: str
    name: str
    file_size: Optional[int] = None
    file_type: Optional[str] = None
    row_count: Optional[int] = None
    column_count: Optional[int] = None
    uploaded_at: datetime

    class Config:
        from_attributes = True

class DatasetList(BaseModel):
    datasets: List[DatasetResponse]

class Dataset(DatasetBase):
    id: str
    project_id: str
    file_path: str
    file_size: Optional[int] = None
    file_type: Optional[str] = None
    row_count: Optional[int] = None
    column_count: Optional[int] = None
    uploaded_at: datetime

    class Config:
        from_attributes = True 