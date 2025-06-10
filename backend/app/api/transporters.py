import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import Transporter as TransporterModel
from app.api.schemas import Transporter, TransporterCreate, TransporterUpdate

router = APIRouter()

@router.get("/", response_model=List[Transporter])
def get_transporters(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    transporters = db.query(TransporterModel).offset(skip).limit(limit).all()
    # Convert vehicle_types from JSON string to list
    for transporter in transporters:
        if transporter.vehicle_types:
            transporter.vehicle_types = json.loads(transporter.vehicle_types)
    return transporters

@router.get("/{transporter_id}", response_model=Transporter)
def get_transporter(transporter_id: int, db: Session = Depends(get_db)):
    transporter = db.query(TransporterModel).filter(TransporterModel.id == transporter_id).first()
    if transporter is None:
        raise HTTPException(status_code=404, detail="Transporter not found")
    
    # Convert vehicle_types from JSON string to list
    if transporter.vehicle_types:
        transporter.vehicle_types = json.loads(transporter.vehicle_types)
    return transporter

@router.post("/", response_model=Transporter, status_code=status.HTTP_201_CREATED)
def create_transporter(transporter: TransporterCreate, db: Session = Depends(get_db)):
    # Check if email already exists
    db_transporter = db.query(TransporterModel).filter(TransporterModel.email == transporter.email).first()
    if db_transporter:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Convert vehicle_types list to JSON string
    transporter_data = transporter.model_dump()
    transporter_data['vehicle_types'] = json.dumps(transporter_data['vehicle_types'])
    
    db_transporter = TransporterModel(**transporter_data)
    db.add(db_transporter)
    db.commit()
    db.refresh(db_transporter)
    
    # Convert back to list for response
    db_transporter.vehicle_types = json.loads(db_transporter.vehicle_types)
    return db_transporter

@router.put("/{transporter_id}", response_model=Transporter)
def update_transporter(transporter_id: int, transporter: TransporterUpdate, db: Session = Depends(get_db)):
    db_transporter = db.query(TransporterModel).filter(TransporterModel.id == transporter_id).first()
    if db_transporter is None:
        raise HTTPException(status_code=404, detail="Transporter not found")
    
    # Check if email is being updated and already exists
    if transporter.email and transporter.email != db_transporter.email:
        existing_transporter = db.query(TransporterModel).filter(TransporterModel.email == transporter.email).first()
        if existing_transporter:
            raise HTTPException(status_code=400, detail="Email already registered")
    
    update_data = transporter.model_dump(exclude_unset=True)
    
    # Convert vehicle_types list to JSON string if provided
    if 'vehicle_types' in update_data:
        update_data['vehicle_types'] = json.dumps(update_data['vehicle_types'])
    
    for field, value in update_data.items():
        setattr(db_transporter, field, value)
    
    db.commit()
    db.refresh(db_transporter)
    
    # Convert back to list for response
    if db_transporter.vehicle_types:
        db_transporter.vehicle_types = json.loads(db_transporter.vehicle_types)
    return db_transporter

@router.delete("/{transporter_id}")
def delete_transporter(transporter_id: int, db: Session = Depends(get_db)):
    db_transporter = db.query(TransporterModel).filter(TransporterModel.id == transporter_id).first()
    if db_transporter is None:
        raise HTTPException(status_code=404, detail="Transporter not found")
    
    db.delete(db_transporter)
    db.commit()
    return {"message": "Transporter deleted successfully"}
