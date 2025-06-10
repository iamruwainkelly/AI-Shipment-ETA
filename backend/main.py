from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db, engine
from app.models import Base
from app.api import clients, products, drivers, transporters, shipments, upload

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.app_name,
    description="AI-powered shipment ETA prediction system",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(clients.router, prefix="/clients", tags=["clients"])
app.include_router(products.router, prefix="/products", tags=["products"])
app.include_router(drivers.router, prefix="/drivers", tags=["drivers"])
app.include_router(transporters.router, prefix="/transporters", tags=["transporters"])
app.include_router(shipments.router, prefix="/shipments", tags=["shipments"])
app.include_router(upload.router, prefix="/upload", tags=["upload"])

@app.get("/")
async def root():
    return {
        "message": "AI Shipment ETA Predictor API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
