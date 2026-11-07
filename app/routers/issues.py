from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import models, schemas, database, auth

router = APIRouter(prefix="/issues", tags=["Issues"])

@router.post("/", response_model=schemas.IssueResponse, status_code=status.HTTP_201_CREATED)
def create_issue(
    issue: schemas.IssueCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Validate project exists
    project = db.query(models.Project).filter(models.Project.id == issue.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    new_issue = models.Issue(**issue.model_dump())
    db.add(new_issue)
    db.commit()
    db.refresh(new_issue)
    return new_issue

@router.get("/", response_model=List[schemas.IssueResponse])
def get_issues(
    project_id: Optional[int] = None,
    status: Optional[models.StatusEnum] = None,
    skip: int = 0, 
    limit: int = 10,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    query = db.query(models.Issue)
    
    # Search and Filter logic
    if project_id:
        query = query.filter(models.Issue.project_id == project_id)
    if status:
        query = query.filter(models.Issue.status == status)
        
    return query.offset(skip).limit(limit).all()

@router.put("/{issue_id}", response_model=schemas.IssueResponse)
def update_issue(
    issue_id: int,
    issue_update: schemas.IssueUpdate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    db_issue = db.query(models.Issue).filter(models.Issue.id == issue_id).first()
    if not db_issue:
        raise HTTPException(status_code=404, detail="Issue not found")
        
    # exclude_unset=True ensures we only update fields the user actually sent
    update_data = issue_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_issue, key, value)
        
    db.commit()
    db.refresh(db_issue)
    return db_issue