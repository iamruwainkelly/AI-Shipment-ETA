import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "AI Shipment ETA Predictor"
    debug: bool = True
    database_url: str = "sqlite:///./shipment_eta.db"
    secret_key: str = "your-secret-key-here-change-in-production"
    openrouteservice_api_key: str = ""
    openweather_api_key: str = ""
    cors_origins: list = ["http://localhost:5173", "http://localhost:3000"]
    
    class Config:
        env_file = ".env"

settings = Settings()
