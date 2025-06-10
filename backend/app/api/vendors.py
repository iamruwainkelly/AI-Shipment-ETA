from fastapi import APIRouter, HTTPException
from typing import Optional, List, Dict, Any
from datetime import datetime
import random

router = APIRouter()

# Mock vendor data
MOCK_VENDORS = [
    {
        "id": 1,
        "name": "Maritime Logistics SA",
        "company": "ML SA Pty Ltd",
        "email": "contact@maritimelogistics.co.za",
        "phone": "+27 21 555 0123",
        "region": "South Africa",
        "service_type": "Sea Freight",
        "performance_score": 94.2,
        "on_time_rate": 92.5,
        "total_shipments": 1247,
        "damage_rate": 0.8,
        "cost_per_kg": 125.60,
        "avg_delivery_time": 12,
        "status": "active",
        "performance_tier": "Excellent",
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2025-06-08T14:22:00Z"
    },
    {
        "id": 2,
        "name": "EuroShip Express",
        "company": "EuroShip GmbH",
        "email": "info@euroshipexpress.de",
        "phone": "+49 40 555 7890",
        "region": "Europe",
        "service_type": "Air Freight",
        "performance_score": 89.7,
        "on_time_rate": 88.2,
        "total_shipments": 987,
        "damage_rate": 1.2,
        "cost_per_kg": 245.30,
        "avg_delivery_time": 3,
        "status": "active",
        "performance_tier": "Good",
        "created_at": "2024-02-20T09:15:00Z",
        "updated_at": "2025-06-08T11:45:00Z"
    },
    {
        "id": 3,
        "name": "African Continental Transport",
        "company": "ACT Transport Ltd",
        "email": "ops@acttransport.co.za",
        "phone": "+27 11 555 4567",
        "region": "South Africa",
        "service_type": "Road Transport",
        "performance_score": 86.5,
        "on_time_rate": 85.1,
        "total_shipments": 756,
        "damage_rate": 2.1,
        "cost_per_kg": 85.40,
        "avg_delivery_time": 5,
        "status": "active",
        "performance_tier": "Good",
        "created_at": "2024-01-10T16:20:00Z",
        "updated_at": "2025-06-07T13:30:00Z"
    },
    {
        "id": 4,
        "name": "Hamburg Freight Solutions",
        "company": "HFS Logistics GmbH",
        "email": "contact@hfs-logistics.de",
        "phone": "+49 40 555 2468",
        "region": "Europe",
        "service_type": "Sea Freight",
        "performance_score": 91.8,
        "on_time_rate": 90.3,
        "total_shipments": 1156,
        "damage_rate": 0.6,
        "cost_per_kg": 135.75,
        "avg_delivery_time": 14,
        "status": "active",
        "performance_tier": "Excellent",
        "created_at": "2024-03-05T08:45:00Z",
        "updated_at": "2025-06-08T10:15:00Z"
    },
    {
        "id": 5,
        "name": "Global Air Cargo",
        "company": "GAC International",
        "email": "booking@globalair.com",
        "phone": "+31 20 555 1357",
        "region": "Global",
        "service_type": "Air Freight",
        "performance_score": 93.4,
        "on_time_rate": 91.7,
        "total_shipments": 2341,
        "damage_rate": 0.4,
        "cost_per_kg": 285.90,
        "avg_delivery_time": 2,
        "status": "active",
        "performance_tier": "Excellent",
        "created_at": "2023-11-12T12:00:00Z",
        "updated_at": "2025-06-08T15:45:00Z"
    }
]

@router.get("/")
async def get_vendors(
    page: Optional[int] = 1,
    per_page: Optional[int] = 10,
    search: Optional[str] = None,
    region: Optional[str] = None,
    service_type: Optional[str] = None,
    status: Optional[str] = None
):
    """Get paginated list of vendors with optional filters"""
    vendors = MOCK_VENDORS.copy()
    
    # Apply filters
    if search:
        vendors = [v for v in vendors if search.lower() in v["name"].lower() or search.lower() in v["company"].lower()]
    
    if region:
        vendors = [v for v in vendors if v["region"] == region]
    
    if service_type:
        vendors = [v for v in vendors if v["service_type"] == service_type]
    
    if status:
        vendors = [v for v in vendors if v["status"] == status]
    
    # Pagination
    total = len(vendors)
    start = (page - 1) * per_page
    end = start + per_page
    paginated_vendors = vendors[start:end]
    
    return {
        "status": "success",
        "data": paginated_vendors,
        "pagination": {
            "page": page,
            "per_page": per_page,
            "total": total,
            "pages": (total + per_page - 1) // per_page
        }
    }

@router.get("/{vendor_id}")
async def get_vendor(vendor_id: int):
    """Get specific vendor by ID"""
    vendor = next((v for v in MOCK_VENDORS if v["id"] == vendor_id), None)
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    
    return {
        "status": "success",
        "data": vendor
    }

@router.post("/")
async def create_vendor(vendor_data: Dict[str, Any]):
    """Create new vendor"""
    new_vendor = {
        "id": max([v["id"] for v in MOCK_VENDORS]) + 1,
        **vendor_data,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }
    
    MOCK_VENDORS.append(new_vendor)
    
    return {
        "status": "success",
        "message": "Vendor created successfully",
        "data": new_vendor
    }

@router.put("/{vendor_id}")
async def update_vendor(vendor_id: int, vendor_data: Dict[str, Any]):
    """Update existing vendor"""
    vendor_index = next((i for i, v in enumerate(MOCK_VENDORS) if v["id"] == vendor_id), None)
    if vendor_index is None:
        raise HTTPException(status_code=404, detail="Vendor not found")
    
    MOCK_VENDORS[vendor_index].update({
        **vendor_data,
        "updated_at": datetime.now().isoformat()
    })
    
    return {
        "status": "success",
        "message": "Vendor updated successfully",
        "data": MOCK_VENDORS[vendor_index]
    }

@router.delete("/{vendor_id}")
async def delete_vendor(vendor_id: int):
    """Delete vendor"""
    vendor_index = next((i for i, v in enumerate(MOCK_VENDORS) if v["id"] == vendor_id), None)
    if vendor_index is None:
        raise HTTPException(status_code=404, detail="Vendor not found")
    
    deleted_vendor = MOCK_VENDORS.pop(vendor_index)
    
    return {
        "status": "success",
        "message": "Vendor deleted successfully",
        "data": deleted_vendor
    }

@router.get("/stats/summary")
async def get_vendor_stats():
    """Get vendor statistics summary"""
    total_vendors = len(MOCK_VENDORS)
    active_vendors = len([v for v in MOCK_VENDORS if v["status"] == "active"])
    avg_performance = sum([v["performance_score"] for v in MOCK_VENDORS]) / total_vendors
    avg_cost_per_kg = sum([v["cost_per_kg"] for v in MOCK_VENDORS]) / total_vendors
    
    performance_tiers = {}
    for vendor in MOCK_VENDORS:
        tier = vendor["performance_tier"]
        performance_tiers[tier] = performance_tiers.get(tier, 0) + 1
    
    return {
        "status": "success",
        "data": {
            "total_vendors": total_vendors,
            "active_vendors": active_vendors,
            "average_performance_score": round(avg_performance, 1),
            "average_cost_per_kg": round(avg_cost_per_kg, 2),
            "performance_tiers": performance_tiers,
            "top_performing_vendors": sorted(MOCK_VENDORS, key=lambda x: x["performance_score"], reverse=True)[:5]
        }
    }
