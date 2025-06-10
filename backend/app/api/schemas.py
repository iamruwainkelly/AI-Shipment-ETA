from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr

# Client schemas
class ClientBase(BaseModel):
    name: str
    email: EmailStr
    phone: str
    address: str
    city: str
    country: str

class ClientCreate(ClientBase):
    pass

class ClientUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None

class Client(ClientBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Product schemas
class ProductBase(BaseModel):
    name: str
    category: str
    weight: float
    dimensions: str
    value: float

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    weight: Optional[float] = None
    dimensions: Optional[str] = None
    value: Optional[float] = None

class Product(ProductBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Driver schemas
class DriverBase(BaseModel):
    name: str
    license_number: str
    phone: str
    email: EmailStr
    vehicle_type: str
    capacity: float
    availability: bool = True
    current_location: str
    rating: float = 5.0

class DriverCreate(DriverBase):
    pass

class DriverUpdate(BaseModel):
    name: Optional[str] = None
    license_number: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    vehicle_type: Optional[str] = None
    capacity: Optional[float] = None
    availability: Optional[bool] = None
    current_location: Optional[str] = None
    rating: Optional[float] = None

class Driver(DriverBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Transporter schemas
class TransporterBase(BaseModel):
    name: str
    contact_person: str
    email: EmailStr
    phone: str
    vehicle_types: List[str]
    base_rate: float
    availability: bool = True
    rating: float = 5.0

class TransporterCreate(TransporterBase):
    pass

class TransporterUpdate(BaseModel):
    name: Optional[str] = None
    contact_person: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    vehicle_types: Optional[List[str]] = None
    base_rate: Optional[float] = None
    availability: Optional[bool] = None
    rating: Optional[float] = None

class Transporter(TransporterBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Shipment schemas
class ShipmentBase(BaseModel):
    client_id: int
    product_id: int
    driver_id: int
    transporter_id: int
    origin: str
    destination: str
    estimated_eta: datetime
    status: str = "pending"
    confidence_score: float = 0.0
    weather_delay_factor: float = 1.0
    route_distance: float = 0.0
    route_duration: float = 0.0

class ShipmentCreate(ShipmentBase):
    pass

class ShipmentUpdate(BaseModel):
    client_id: Optional[int] = None
    product_id: Optional[int] = None
    driver_id: Optional[int] = None
    transporter_id: Optional[int] = None
    origin: Optional[str] = None
    destination: Optional[str] = None
    estimated_eta: Optional[datetime] = None
    actual_eta: Optional[datetime] = None
    status: Optional[str] = None
    confidence_score: Optional[float] = None
    weather_delay_factor: Optional[float] = None
    route_distance: Optional[float] = None
    route_duration: Optional[float] = None

class Shipment(ShipmentBase):
    id: int
    actual_eta: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    client: Optional[Client] = None
    product: Optional[Product] = None
    driver: Optional[Driver] = None
    transporter: Optional[Transporter] = None
    
    class Config:
        from_attributes = True

# ETA Calculation schemas
class ETARequest(BaseModel):
    origin: str
    destination: str

class ETAResponse(BaseModel):
    estimated_eta: Optional[datetime] = None
    predicted_eta: Optional[str] = None
    confidence_score: Optional[float] = None
    confidence: Optional[float] = None
    route_distance: Optional[float] = None
    route_duration: Optional[float] = None
    weather_delay_factor: Optional[float] = None
    route_geometry: Optional[dict] = None
    shipment_id: Optional[int] = None
    factors: Optional[List[str]] = None
    risk_level: Optional[str] = None
    recommendations: Optional[List[str]] = None

# Upload response schema
class UploadResponse(BaseModel):
    success: bool
    message: str
    count: int
