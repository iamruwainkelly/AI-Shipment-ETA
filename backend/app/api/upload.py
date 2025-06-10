import pandas as pd
import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import Client as ClientModel, Product as ProductModel, Driver as DriverModel, Transporter as TransporterModel
from app.api.schemas import UploadResponse

router = APIRouter()

@router.post("/clients", response_model=UploadResponse)
async def upload_clients_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Upload clients from CSV file"""
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="File must be a CSV")
    
    try:
        # Read CSV file
        content = await file.read()
        df = pd.read_csv(pd.io.common.StringIO(content.decode('utf-8')))
        
        # Validate required columns
        required_columns = ['name', 'email', 'phone', 'address', 'city', 'country']
        if not all(col in df.columns for col in required_columns):
            raise HTTPException(
                status_code=400, 
                detail=f"CSV must contain columns: {', '.join(required_columns)}"
            )
        
        # Process each row
        created_count = 0
        for _, row in df.iterrows():
            # Check if client already exists
            existing_client = db.query(ClientModel).filter(ClientModel.email == row['email']).first()
            if existing_client:
                continue
            
            # Create new client
            client = ClientModel(
                name=str(row['name']),
                email=str(row['email']),
                phone=str(row['phone']),
                address=str(row['address']),
                city=str(row['city']),
                country=str(row['country'])
            )
            db.add(client)
            created_count += 1
        
        db.commit()
        return UploadResponse(
            success=True,
            message=f"Successfully imported {created_count} clients",
            count=created_count
        )
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error processing CSV: {str(e)}")

@router.post("/products", response_model=UploadResponse)
async def upload_products_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Upload products from CSV file"""
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="File must be a CSV")
    
    try:
        content = await file.read()
        df = pd.read_csv(pd.io.common.StringIO(content.decode('utf-8')))
        
        required_columns = ['name', 'category', 'weight', 'dimensions', 'value']
        if not all(col in df.columns for col in required_columns):
            raise HTTPException(
                status_code=400, 
                detail=f"CSV must contain columns: {', '.join(required_columns)}"
            )
        
        created_count = 0
        for _, row in df.iterrows():
            product = ProductModel(
                name=str(row['name']),
                category=str(row['category']),
                weight=float(row['weight']),
                dimensions=str(row['dimensions']),
                value=float(row['value'])
            )
            db.add(product)
            created_count += 1
        
        db.commit()
        return UploadResponse(
            success=True,
            message=f"Successfully imported {created_count} products",
            count=created_count
        )
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error processing CSV: {str(e)}")

@router.post("/drivers", response_model=UploadResponse)
async def upload_drivers_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Upload drivers from CSV file"""
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="File must be a CSV")
    
    try:
        content = await file.read()
        df = pd.read_csv(pd.io.common.StringIO(content.decode('utf-8')))
        
        required_columns = ['name', 'license_number', 'phone', 'email', 'vehicle_type', 'capacity', 'current_location', 'rating']
        if not all(col in df.columns for col in required_columns):
            raise HTTPException(
                status_code=400, 
                detail=f"CSV must contain columns: {', '.join(required_columns)}"
            )
        
        created_count = 0
        for _, row in df.iterrows():
            # Check if driver already exists
            existing_driver = db.query(DriverModel).filter(
                (DriverModel.email == row['email']) | 
                (DriverModel.license_number == row['license_number'])
            ).first()
            if existing_driver:
                continue
            
            driver = DriverModel(
                name=str(row['name']),
                license_number=str(row['license_number']),
                phone=str(row['phone']),
                email=str(row['email']),
                vehicle_type=str(row['vehicle_type']),
                capacity=float(row['capacity']),
                availability=True,  # Default to available
                current_location=str(row['current_location']),
                rating=float(row['rating'])
            )
            db.add(driver)
            created_count += 1
        
        db.commit()
        return UploadResponse(
            success=True,
            message=f"Successfully imported {created_count} drivers",
            count=created_count
        )
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error processing CSV: {str(e)}")

@router.post("/transporters", response_model=UploadResponse)
async def upload_transporters_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Upload transporters from CSV file"""
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="File must be a CSV")
    
    try:
        content = await file.read()
        df = pd.read_csv(pd.io.common.StringIO(content.decode('utf-8')))
        
        required_columns = ['name', 'contact_person', 'email', 'phone', 'vehicle_types', 'base_rate', 'rating']
        if not all(col in df.columns for col in required_columns):
            raise HTTPException(
                status_code=400, 
                detail=f"CSV must contain columns: {', '.join(required_columns)}"
            )
        
        created_count = 0
        for _, row in df.iterrows():
            # Check if transporter already exists
            existing_transporter = db.query(TransporterModel).filter(TransporterModel.email == row['email']).first()
            if existing_transporter:
                continue
            
            # Parse vehicle_types (could be comma-separated string)
            vehicle_types = str(row['vehicle_types']).split(',')
            vehicle_types = [vt.strip() for vt in vehicle_types]
            
            transporter = TransporterModel(
                name=str(row['name']),
                contact_person=str(row['contact_person']),
                email=str(row['email']),
                phone=str(row['phone']),
                vehicle_types=json.dumps(vehicle_types),
                base_rate=float(row['base_rate']),
                availability=True,  # Default to available
                rating=float(row['rating'])
            )
            db.add(transporter)
            created_count += 1
        
        db.commit()
        return UploadResponse(
            success=True,
            message=f"Successfully imported {created_count} transporters",
            count=created_count
        )
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error processing CSV: {str(e)}")
