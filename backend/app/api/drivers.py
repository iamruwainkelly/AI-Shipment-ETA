from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import Driver as DriverModel
from app.api.schemas import Driver, DriverCreate, DriverUpdate

router = APIRouter()

@router.get("/", response_model=List[Driver])
def get_drivers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    drivers = db.query(DriverModel).offset(skip).limit(limit).all()
    return drivers

@router.get("/{driver_id}", response_model=Driver)
def get_driver(driver_id: int, db: Session = Depends(get_db)):
    driver = db.query(DriverModel).filter(DriverModel.id == driver_id).first()
    if driver is None:
        raise HTTPException(status_code=404, detail="Driver not found")
    return driver

@router.post("/", response_model=Driver, status_code=status.HTTP_201_CREATED)
def create_driver(driver: DriverCreate, db: Session = Depends(get_db)):
    # Check if email or license number already exists
    db_driver = db.query(DriverModel).filter(
        (DriverModel.email == driver.email) | 
        (DriverModel.license_number == driver.license_number)
    ).first()
    if db_driver:
        raise HTTPException(status_code=400, detail="Email or license number already registered")
    
    db_driver = DriverModel(**driver.model_dump())
    db.add(db_driver)
    db.commit()
    db.refresh(db_driver)
    return db_driver

@router.put("/{driver_id}", response_model=Driver)
def update_driver(driver_id: int, driver: DriverUpdate, db: Session = Depends(get_db)):
    db_driver = db.query(DriverModel).filter(DriverModel.id == driver_id).first()
    if db_driver is None:
        raise HTTPException(status_code=404, detail="Driver not found")
    
    # Check if email or license number is being updated and already exists
    if driver.email and driver.email != db_driver.email:
        existing_driver = db.query(DriverModel).filter(DriverModel.email == driver.email).first()
        if existing_driver:
            raise HTTPException(status_code=400, detail="Email already registered")
    
    if driver.license_number and driver.license_number != db_driver.license_number:
        existing_driver = db.query(DriverModel).filter(DriverModel.license_number == driver.license_number).first()
        if existing_driver:
            raise HTTPException(status_code=400, detail="License number already registered")
    
    update_data = driver.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_driver, field, value)
    
    db.commit()
    db.refresh(db_driver)
    return db_driver

@router.delete("/{driver_id}")
def delete_driver(driver_id: int, db: Session = Depends(get_db)):
    db_driver = db.query(DriverModel).filter(DriverModel.id == driver_id).first()
    if db_driver is None:
        raise HTTPException(status_code=404, detail="Driver not found")
    
    db.delete(db_driver)
    db.commit()
    return {"message": "Driver deleted successfully"}

@router.get("/available/", response_model=List[Driver])
def get_available_drivers(db: Session = Depends(get_db)):
    drivers = db.query(DriverModel).filter(DriverModel.availability == True).all()
    return drivers
