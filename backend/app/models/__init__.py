from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Client(Base):
    __tablename__ = "clients"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=False)
    address = Column(Text, nullable=False)
    city = Column(String, nullable=False)
    country = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    shipments = relationship("Shipment", back_populates="client")

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    category = Column(String, nullable=False)
    weight = Column(Float, nullable=False)  # in kg
    dimensions = Column(String, nullable=False)  # format: "LxWxH"
    value = Column(Float, nullable=False)  # in USD
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    shipments = relationship("Shipment", back_populates="product")

class Driver(Base):
    __tablename__ = "drivers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    license_number = Column(String, unique=True, nullable=False)
    phone = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    vehicle_type = Column(String, nullable=False)  # Van, Truck, Semi, etc.
    capacity = Column(Float, nullable=False)  # in kg
    availability = Column(Boolean, default=True)
    current_location = Column(String, nullable=False)
    rating = Column(Float, default=5.0)  # 1.0 to 5.0
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    shipments = relationship("Shipment", back_populates="driver")

class Transporter(Base):
    __tablename__ = "transporters"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    contact_person = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=False)
    vehicle_types = Column(Text, nullable=False)  # JSON array as string
    base_rate = Column(Float, nullable=False)  # per km
    availability = Column(Boolean, default=True)
    rating = Column(Float, default=5.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    shipments = relationship("Shipment", back_populates="transporter")

class Shipment(Base):
    __tablename__ = "shipments"
    
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    driver_id = Column(Integer, ForeignKey("drivers.id"), nullable=False)
    transporter_id = Column(Integer, ForeignKey("transporters.id"), nullable=False)
    
    origin = Column(String, nullable=False)
    destination = Column(String, nullable=False)
    estimated_eta = Column(DateTime(timezone=True), nullable=False)
    actual_eta = Column(DateTime(timezone=True), nullable=True)
    
    status = Column(String, default="pending")  # pending, in_transit, delivered, delayed
    confidence_score = Column(Float, default=0.0)  # 0.0 to 1.0
    weather_delay_factor = Column(Float, default=1.0)  # multiplier
    route_distance = Column(Float, default=0.0)  # in meters
    route_duration = Column(Float, default=0.0)  # in seconds
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    client = relationship("Client", back_populates="shipments")
    product = relationship("Product", back_populates="shipments")
    driver = relationship("Driver", back_populates="shipments")
    transporter = relationship("Transporter", back_populates="shipments")
