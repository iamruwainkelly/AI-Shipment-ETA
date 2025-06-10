from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Client(Base):
    __tablename__ = "clients"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, index=True, nullable=False)
    email = Column(String(255), index=True)
    phone = Column(String(50))
    address = Column(Text)
    preferred_transport_mode = Column(String(50), default="road")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    shipments = relationship("Shipment", back_populates="client")

class Vendor(Base):
    __tablename__ = "vendors"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, index=True, nullable=False)
    email = Column(String(255))
    phone = Column(String(50))
    reliability_score = Column(Float, default=0.8)  # 0.0 to 1.0
    regions_covered = Column(Text)  # JSON string of regions
    transport_modes = Column(Text)  # JSON string of supported modes
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    shipments = relationship("Shipment", back_populates="vendor")

class Shipment(Base):
    __tablename__ = "shipments"
    
    id = Column(Integer, primary_key=True, index=True)
    tracking_number = Column(String(100), unique=True, index=True)
    origin = Column(String(255), nullable=False)
    destination = Column(String(255), nullable=False)
    weight = Column(Float, nullable=False)  # in kg
    transport_mode = Column(String(50), default="road")
    cargo_type = Column(String(50), default="general")
    priority = Column(String(50), default="standard")
    
    # ETA Predictions
    eta_days = Column(Float)
    risk_level = Column(String(20))  # "Low", "Medium", "High"
    confidence_score = Column(Float)  # 0.0 to 1.0
    delay_factors = Column(Text)  # JSON string of factors
    
    # Status tracking
    status = Column(String(50), default="pending")  # pending, in_transit, delivered, delayed
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    estimated_delivery = Column(DateTime(timezone=True))
    actual_delivery = Column(DateTime(timezone=True))
    
    # Foreign Keys
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    vendor_id = Column(Integer, ForeignKey("vendors.id"), nullable=False)
    
    # Relationships
    client = relationship("Client", back_populates="shipments")
    vendor = relationship("Vendor", back_populates="shipments")
