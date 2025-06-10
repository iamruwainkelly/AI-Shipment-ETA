from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.core.database import get_db
from app.models import Shipment as ShipmentModel, Driver as DriverModel, Product as ProductModel
from app.api.schemas import Shipment, ShipmentCreate, ShipmentUpdate, ETARequest, ETAResponse, Driver
from app.services.eta_service import eta_service
from io import BytesIO
import json

router = APIRouter()

@router.get("/", response_model=List[Shipment])
def get_shipments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    shipments = db.query(ShipmentModel).offset(skip).limit(limit).all()
    return shipments

@router.get("/{shipment_id}", response_model=Shipment)
def get_shipment(shipment_id: int, db: Session = Depends(get_db)):
    shipment = db.query(ShipmentModel).filter(ShipmentModel.id == shipment_id).first()
    if shipment is None:
        raise HTTPException(status_code=404, detail="Shipment not found")
    return shipment

@router.post("/", response_model=Shipment, status_code=status.HTTP_201_CREATED)
def create_shipment(shipment: ShipmentCreate, db: Session = Depends(get_db)):
    db_shipment = ShipmentModel(**shipment.model_dump())
    db.add(db_shipment)
    db.commit()
    db.refresh(db_shipment)
    return db_shipment

@router.put("/{shipment_id}", response_model=Shipment)
def update_shipment(shipment_id: int, shipment: ShipmentUpdate, db: Session = Depends(get_db)):
    db_shipment = db.query(ShipmentModel).filter(ShipmentModel.id == shipment_id).first()
    if db_shipment is None:
        raise HTTPException(status_code=404, detail="Shipment not found")
    
    update_data = shipment.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_shipment, field, value)
    
    db.commit()
    db.refresh(db_shipment)
    return db_shipment

@router.delete("/{shipment_id}")
def delete_shipment(shipment_id: int, db: Session = Depends(get_db)):
    db_shipment = db.query(ShipmentModel).filter(ShipmentModel.id == shipment_id).first()
    if db_shipment is None:
        raise HTTPException(status_code=404, detail="Shipment not found")
    
    db.delete(db_shipment)
    db.commit()
    return {"message": "Shipment deleted successfully"}

@router.post("/calculate-eta", response_model=ETAResponse)
async def calculate_eta(eta_request: ETARequest):
    """Calculate ETA for a route"""
    try:
        eta_data = await eta_service.calculate_eta(eta_request.origin, eta_request.destination)
        return ETAResponse(**eta_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to calculate ETA: {str(e)}")

@router.post("/optimal-driver", response_model=Driver)
def get_optimal_driver(
    shipment_data: dict,
    db: Session = Depends(get_db)
):
    """Get the optimal driver for a shipment based on availability, capacity, and rating"""
    try:
        # Get product weight to determine capacity requirements
        product_id = shipment_data.get("product_id")
        if not product_id:
            raise HTTPException(status_code=400, detail="Product ID is required")
        
        product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Find available drivers with sufficient capacity
        available_drivers = db.query(DriverModel).filter(
            and_(
                DriverModel.availability == True,
                DriverModel.capacity >= product.weight
            )
        ).all()
        
        if not available_drivers:
            raise HTTPException(status_code=404, detail="No available drivers with sufficient capacity")
        
        # Sort by rating (highest first) and return the best driver
        optimal_driver = max(available_drivers, key=lambda d: d.rating)
        return optimal_driver
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to find optimal driver: {str(e)}")

@router.get("/{shipment_id}/invoice")
def generate_invoice(shipment_id: int, db: Session = Depends(get_db)):
    """Generate PDF invoice for a shipment"""
    shipment = db.query(ShipmentModel).filter(ShipmentModel.id == shipment_id).first()
    if shipment is None:
        raise HTTPException(status_code=404, detail="Shipment not found")
    
    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.units import inch
        from reportlab.lib import colors
        
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        styles = getSampleStyleSheet()
        story = []
        
        # Title
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            alignment=1  # Center
        )
        story.append(Paragraph("SHIPMENT INVOICE", title_style))
        story.append(Spacer(1, 12))
        
        # Shipment details
        data = [
            ['Shipment ID:', str(shipment.id)],
            ['Origin:', shipment.origin],
            ['Destination:', shipment.destination],
            ['Status:', shipment.status.upper()],
            ['Estimated ETA:', shipment.estimated_eta.strftime('%Y-%m-%d %H:%M')],
            ['Distance:', f"{shipment.route_distance/1000:.1f} km"],
            ['Confidence Score:', f"{shipment.confidence_score*100:.1f}%"],
        ]
        
        if shipment.client:
            data.extend([
                ['Client Name:', shipment.client.name],
                ['Client Email:', shipment.client.email],
            ])
        
        if shipment.product:
            data.extend([
                ['Product:', shipment.product.name],
                ['Category:', shipment.product.category],
                ['Weight:', f"{shipment.product.weight} kg"],
                ['Value:', f"${shipment.product.value:.2f}"],
            ])
        
        if shipment.driver:
            data.extend([
                ['Driver:', shipment.driver.name],
                ['Driver Phone:', shipment.driver.phone],
                ['Vehicle Type:', shipment.driver.vehicle_type],
            ])
        
        table = Table(data, colWidths=[2*inch, 4*inch])
        table.setStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.grey),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('BACKGROUND', (1, 0), (1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ])
        
        story.append(table)
        doc.build(story)
        
        buffer.seek(0)
        return StreamingResponse(
            BytesIO(buffer.read()),
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=invoice_{shipment_id}.pdf"}
        )
        
    except ImportError:
        # Fallback if reportlab is not available
        return {"message": "PDF generation not available. Install reportlab package."}

@router.post("/{shipment_id}/predict-eta", response_model=ETAResponse)
async def predict_shipment_eta(shipment_id: int, db: Session = Depends(get_db)):
    """Predict ETA for a specific shipment using AI"""
    try:
        # Get shipment details
        shipment = db.query(ShipmentModel).filter(ShipmentModel.id == shipment_id).first()
        if not shipment:
            raise HTTPException(status_code=404, detail="Shipment not found")
        
        # Use ETA service to predict arrival time
        eta_data = await eta_service.predict_eta_with_ai(
            origin=shipment.origin,
            destination=shipment.destination,
            shipment_data={
                "id": shipment.id,
                "weight": shipment.weight,
                "volume": shipment.volume,
                "priority": shipment.priority,
                "transport_mode": shipment.transport_mode
            }
        )
        
        # Update shipment with predicted ETA
        shipment.predicted_eta = eta_data.get("predicted_eta")
        shipment.ai_confidence = eta_data.get("confidence", 85.0)
        db.commit()
        
        return ETAResponse(
            shipment_id=shipment_id,
            predicted_eta=eta_data.get("predicted_eta"),
            confidence=eta_data.get("confidence", 85.0),
            factors=eta_data.get("factors", ["weather", "traffic", "carrier_performance"]),
            risk_level=eta_data.get("risk_level", "medium"),
            recommendations=eta_data.get("recommendations", [
                "Monitor weather conditions",
                "Track carrier performance"
            ])
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to predict ETA: {str(e)}")
