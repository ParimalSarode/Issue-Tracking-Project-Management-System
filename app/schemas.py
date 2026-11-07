from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime
from .models import RoleEnum, StatusEnum

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    role: RoleEnum
    
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class IssueBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: StatusEnum = StatusEnum.open
    assignee_id: Optional[int] = None

class IssueCreate(IssueBase):
    project_id: int

class IssueUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[StatusEnum] = None
    assignee_id: Optional[int] = None

class IssueResponse(IssueBase):
    id: int
    project_id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
