from fastapi import APIRouter, HTTPException
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
import random

router = APIRouter()

# Mock data for dashboard
MOCK_STATS = {
    "total_shipments": 1247,
    "in_transit": 89,
    "at_risk": 12,
    "delivered": 1146,
    "ai_accuracy": 94.2,
    "total_revenue": 2450000,
    "avg_delivery_time": 12.4,
    "customer_satisfaction": 94.2
}

MOCK_CHART_DATA = {
    "revenue_trend": {
        "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        "datasets": [{
            "label": "Revenue (ZAR)",
            "data": [420000, 480000, 510000, 475000, 498000, 549600],
            "borderColor": "#3b82f6",
            "backgroundColor": "rgba(59, 130, 246, 0.1)"
        }]
    },
    "transport_modes": {
        "labels": ["Sea Freight", "Air Freight", "Road Transport", "Rail Transport"],
        "datasets": [{
            "data": [532, 398, 251, 66],
            "backgroundColor": ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"]
        }]
    },
    "delivery_performance": {
        "labels": ["On Time", "Early", "Delayed", "In Transit"],
        "datasets": [{
            "data": [891, 255, 89, 12],
            "backgroundColor": ["#10b981", "#3b82f6", "#ef4444", "#f59e0b"]
        }]
    }
}

@router.get("/summary")
async def get_dashboard_summary(timeframe: Optional[str] = "30d"):
    """Get dashboard summary statistics"""
    # Simulate different data based on timeframe
    stats = MOCK_STATS.copy()
    
    if timeframe == "7d":
        stats["total_shipments"] = int(stats["total_shipments"] * 0.2)
        stats["in_transit"] = int(stats["in_transit"] * 0.3)
        stats["delivered"] = int(stats["delivered"] * 0.2)
    elif timeframe == "90d":
        stats["total_shipments"] = int(stats["total_shipments"] * 3.5)
        stats["delivered"] = int(stats["delivered"] * 3.5)
    elif timeframe == "1y":
        stats["total_shipments"] = int(stats["total_shipments"] * 12)
        stats["delivered"] = int(stats["delivered"] * 12)
    
    return {
        "status": "success",
        "data": stats,
        "timeframe": timeframe,
        "last_updated": datetime.now().isoformat()
    }

@router.get("/charts/{chart_type}")
async def get_chart_data(chart_type: str, timeframe: Optional[str] = "30d"):
    """Get specific chart data"""
    if chart_type not in MOCK_CHART_DATA:
        raise HTTPException(status_code=404, detail="Chart type not found")
    
    data = MOCK_CHART_DATA[chart_type].copy()
    
    # Modify data based on timeframe
    if timeframe == "7d":
        data["labels"] = data["labels"][-7:] if len(data["labels"]) > 7 else data["labels"]
        for dataset in data["datasets"]:
            dataset["data"] = dataset["data"][-7:] if len(dataset["data"]) > 7 else dataset["data"]
    
    return {
        "status": "success",
        "data": data,
        "chart_type": chart_type,
        "timeframe": timeframe
    }

@router.get("/recent-activities")
async def get_recent_activities(limit: Optional[int] = 10):
    """Get recent dashboard activities"""
    activities = [
        {
            "id": 1,
            "type": "shipment",
            "message": "Shipment SH-2025-001 delivered to Cape Town",
            "timestamp": (datetime.now() - timedelta(minutes=30)).isoformat(),
            "severity": "info"
        },
        {
            "id": 2,
            "type": "delay",
            "message": "Shipment SH-2025-002 delayed due to weather conditions",
            "timestamp": (datetime.now() - timedelta(minutes=45)).isoformat(),
            "severity": "warning"
        },
        {
            "id": 3,
            "type": "delivery",
            "message": "New shipment SH-2025-003 created for Hamburg route",
            "timestamp": (datetime.now() - timedelta(hours=1)).isoformat(),
            "severity": "success"
        },
        {
            "id": 4,
            "type": "alert",
            "message": "High traffic detected on Durban-Rotterdam route",
            "timestamp": (datetime.now() - timedelta(hours=2)).isoformat(),
            "severity": "warning"
        },
        {
            "id": 5,
            "type": "shipment",
            "message": "Shipment SH-2025-004 departed from Johannesburg",
            "timestamp": (datetime.now() - timedelta(hours=3)).isoformat(),
            "severity": "info"
        }
    ]
    
    return {
        "status": "success",
        "data": activities[:limit],
        "total": len(activities)
    }
