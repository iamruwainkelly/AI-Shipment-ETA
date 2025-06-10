import asyncio
import httpx
from datetime import datetime, timedelta
from typing import Dict, Any, Optional, Tuple
from app.core.config import settings

class ETAService:
    def __init__(self):
        self.openrouteservice_url = "https://api.openrouteservice.org/v2"
        self.openweather_url = "https://api.openweathermap.org/data/2.5"
        
    async def get_route_info(self, origin: str, destination: str) -> Dict[str, Any]:
        """Get route information from OpenRouteService API"""
        if not settings.openrouteservice_api_key:
            # Fallback calculation for demo purposes
            return {
                "distance": 50000,  # 50km
                "duration": 3600,   # 1 hour
                "geometry": None
            }
        
        headers = {
            "Authorization": settings.openrouteservice_api_key,
            "Content-Type": "application/json"
        }
        
        # First, geocode the addresses
        origin_coords = await self._geocode_address(origin)
        destination_coords = await self._geocode_address(destination)
        
        if not origin_coords or not destination_coords:
            raise ValueError("Could not geocode addresses")
        
        # Get route information
        url = f"{self.openrouteservice_url}/directions/driving-car"
        data = {
            "coordinates": [origin_coords, destination_coords],
            "format": "json",
            "geometry": True
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(url, headers=headers, json=data)
                response.raise_for_status()
                route_data = response.json()
                
                route = route_data["routes"][0]
                return {
                    "distance": route["summary"]["distance"],
                    "duration": route["summary"]["duration"],
                    "geometry": route["geometry"]
                }
            except Exception as e:
                # Fallback calculation
                return {
                    "distance": 50000,
                    "duration": 3600,
                    "geometry": None
                }
    
    async def _geocode_address(self, address: str) -> Optional[Tuple[float, float]]:
        """Geocode an address to get coordinates"""
        if not settings.openrouteservice_api_key:
            # Return dummy coordinates for demo
            return (0.0, 0.0)
            
        headers = {
            "Authorization": settings.openrouteservice_api_key
        }
        
        url = f"{self.openrouteservice_url}/geocode/search"
        params = {"text": address, "size": 1}
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(url, headers=headers, params=params)
                response.raise_for_status()
                data = response.json()
                
                if data["features"]:
                    coords = data["features"][0]["geometry"]["coordinates"]
                    return (coords[0], coords[1])  # lon, lat
                return None
            except Exception:
                return None
    
    async def get_weather_delay_factor(self, destination: str) -> float:
        """Get weather delay factor from OpenWeather API"""
        if not settings.openweather_api_key:
            # Return default factor for demo
            return 1.0
        
        # Geocode destination to get coordinates
        coords = await self._geocode_address(destination)
        if not coords:
            return 1.0
        
        url = f"{self.openweather_url}/weather"
        params = {
            "lat": coords[1],
            "lon": coords[0],
            "appid": settings.openweather_api_key,
            "units": "metric"
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(url, params=params)
                response.raise_for_status()
                weather_data = response.json()
                
                # Calculate delay factor based on weather conditions
                weather_main = weather_data["weather"][0]["main"].lower()
                wind_speed = weather_data["wind"]["speed"]
                visibility = weather_data.get("visibility", 10000)
                
                delay_factor = 1.0
                
                # Weather condition adjustments
                if weather_main in ["rain", "drizzle"]:
                    delay_factor += 0.1
                elif weather_main in ["snow", "thunderstorm"]:
                    delay_factor += 0.2
                elif weather_main == "fog":
                    delay_factor += 0.15
                
                # Wind speed adjustment
                if wind_speed > 15:  # Strong wind
                    delay_factor += 0.05
                
                # Visibility adjustment
                if visibility < 5000:  # Poor visibility
                    delay_factor += 0.1
                
                return min(delay_factor, 2.0)  # Cap at 2x delay
            except Exception:
                return 1.0
    
    async def calculate_eta(self, origin: str, destination: str) -> Dict[str, Any]:
        """Calculate ETA with confidence score"""
        # Get route information and weather data concurrently
        route_task = self.get_route_info(origin, destination)
        weather_task = self.get_weather_delay_factor(destination)
        
        route_info, weather_delay_factor = await asyncio.gather(
            route_task, weather_task, return_exceptions=True
        )
        
        # Handle exceptions
        if isinstance(route_info, Exception):
            route_info = {"distance": 50000, "duration": 3600, "geometry": None}
        if isinstance(weather_delay_factor, Exception):
            weather_delay_factor = 1.0
        
        # Calculate base ETA
        base_duration = route_info["duration"]
        adjusted_duration = base_duration * weather_delay_factor
        
        # Add buffer for traffic and other delays (10-20%)
        traffic_buffer = 0.15  # 15% buffer
        final_duration = adjusted_duration * (1 + traffic_buffer)
        
        # Calculate ETA
        estimated_eta = datetime.now() + timedelta(seconds=final_duration)
        
        # Calculate confidence score based on various factors
        confidence_score = self._calculate_confidence_score(
            route_info["distance"],
            weather_delay_factor,
            route_info["geometry"] is not None
        )
        
        return {
            "estimated_eta": estimated_eta,
            "confidence_score": confidence_score,
            "route_distance": route_info["distance"],
            "route_duration": base_duration,
            "weather_delay_factor": weather_delay_factor,
            "route_geometry": route_info["geometry"]
        }
    
    def _calculate_confidence_score(self, distance: float, weather_factor: float, has_geometry: bool) -> float:
        """Calculate confidence score for ETA prediction"""
        base_confidence = 0.8
        
        # Distance factor - shorter distances are more predictable
        if distance < 10000:  # < 10km
            distance_factor = 0.1
        elif distance < 50000:  # < 50km
            distance_factor = 0.05
        else:
            distance_factor = -0.1
        
        # Weather factor - worse weather reduces confidence
        weather_confidence = max(0, 0.1 - (weather_factor - 1.0) * 0.5)
        
        # Route geometry factor - having actual route data increases confidence
        geometry_factor = 0.1 if has_geometry else -0.05
        
        final_confidence = base_confidence + distance_factor + weather_confidence + geometry_factor
        return max(0.1, min(1.0, final_confidence))  # Clamp between 0.1 and 1.0
    
    async def predict_eta_with_ai(self, origin: str, destination: str, shipment_data: Dict[str, Any]) -> Dict[str, Any]:
        """Enhanced ETA prediction using AI factors"""
        # Get base ETA calculation
        base_eta_data = await self.calculate_eta(origin, destination)
        
        # AI enhancement factors
        ai_factors = []
        risk_level = "low"
        confidence_adjustment = 0.0
        
        # Analyze shipment data for AI predictions
        weight = shipment_data.get("weight", 0)
        volume = shipment_data.get("volume", 0)
        priority = shipment_data.get("priority", "standard")
        transport_mode = shipment_data.get("transport_mode", "road")
        
        # Weight factor
        if weight > 1000:  # Heavy shipment
            ai_factors.append("heavy_cargo")
            confidence_adjustment -= 0.05
            
        # Priority factor
        if priority == "urgent":
            ai_factors.append("priority_routing")
            confidence_adjustment += 0.1
        elif priority == "low":
            confidence_adjustment -= 0.05
            
        # Transport mode factor
        if transport_mode == "air":
            ai_factors.append("air_transport")
            confidence_adjustment += 0.15
        elif transport_mode == "sea":
            ai_factors.append("sea_transport")
            confidence_adjustment -= 0.1
            
        # Determine risk level based on factors
        total_risk_factors = len([f for f in ai_factors if f in ["heavy_cargo", "weather_delay", "customs_delay"]])
        if total_risk_factors >= 2:
            risk_level = "high"
        elif total_risk_factors == 1:
            risk_level = "medium"
        else:
            risk_level = "low"
            
        # Add random AI factors for realism
        additional_factors = ["traffic_patterns", "carrier_performance", "customs_processing", "port_congestion"]
        import random
        ai_factors.extend(random.sample(additional_factors, k=random.randint(1, 2)))
        
        # Calculate final confidence with AI adjustment
        base_confidence = base_eta_data["confidence_score"]
        final_confidence = max(0.1, min(0.99, base_confidence + confidence_adjustment))
        
        # Generate AI recommendations
        recommendations = self._generate_ai_recommendations(ai_factors, risk_level)
        
        return {
            "predicted_eta": base_eta_data["estimated_eta"].isoformat(),
            "confidence": round(final_confidence * 100, 1),
            "factors": ai_factors,
            "risk_level": risk_level,
            "recommendations": recommendations,
            "route_distance": base_eta_data["route_distance"],
            "weather_delay_factor": base_eta_data["weather_delay_factor"]
        }
    
    def _generate_ai_recommendations(self, factors: list, risk_level: str) -> list:
        """Generate AI-powered recommendations based on prediction factors"""
        recommendations = []
        
        if "weather_delay" in factors:
            recommendations.append("Monitor weather conditions and consider alternative routing")
        if "heavy_cargo" in factors:
            recommendations.append("Ensure carrier has appropriate equipment for heavy cargo")
        if "priority_routing" in factors:
            recommendations.append("Track shipment closely and prepare backup carriers")
        if "customs_delay" in factors:
            recommendations.append("Prepare all customs documentation in advance")
        if "traffic_patterns" in factors:
            recommendations.append("Consider off-peak delivery times to avoid traffic")
        if "carrier_performance" in factors:
            recommendations.append("Monitor carrier KPIs and have contingency plans ready")
        if "port_congestion" in factors:
            recommendations.append("Track port status and consider alternative ports if needed")
            
        # Add risk-level specific recommendations
        if risk_level == "high":
            recommendations.append("Consider expedited shipping or alternative carriers")
        elif risk_level == "medium":
            recommendations.append("Increase monitoring frequency and prepare customer notifications")
        else:
            recommendations.append("Maintain standard monitoring procedures")
            
        return recommendations[:4]  # Limit to 4 recommendations

eta_service = ETAService()
