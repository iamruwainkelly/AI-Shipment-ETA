from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
import json
import io

router = APIRouter()

# Mock analytics data
MOCK_METRICS = {
    "avg_delivery_time": 12.4,
    "cost_per_kg": 125.60,
    "customer_satisfaction": 94.2,
    "fuel_efficiency": 8.7,
    "on_time_delivery_rate": 91.5,
    "damage_rate": 1.2,
    "total_revenue": 2450000,
    "total_shipments": 1247,
    "profit_margin": 23.8
}

MOCK_ROUTE_PERFORMANCE = [
    {
        "id": 1,
        "origin": "Cape Town",
        "destination": "Hamburg", 
        "volume": 1247,
        "avg_cost": 15680,
        "on_time_percentage": 92,
        "revenue": 2450000,
        "profit_margin": 23.5,
        "avg_delivery_time": 14,
        "transport_mode": "Sea Freight"
    },
    {
        "id": 2,
        "origin": "Durban",
        "destination": "Rotterdam",
        "volume": 987,
        "avg_cost": 14200,
        "on_time_percentage": 89,
        "revenue": 1980000,
        "profit_margin": 21.8,
        "avg_delivery_time": 13,
        "transport_mode": "Sea Freight"
    },
    {
        "id": 3,
        "origin": "Johannesburg",
        "destination": "Frankfurt",
        "volume": 756,
        "avg_cost": 22450,
        "on_time_percentage": 94,
        "revenue": 2890000,
        "profit_margin": 28.2,
        "avg_delivery_time": 3,
        "transport_mode": "Air Freight"
    },
    {
        "id": 4,
        "origin": "Berlin",
        "destination": "Cape Town",
        "volume": 654,
        "avg_cost": 16780,
        "on_time_percentage": 86,
        "revenue": 2150000,
        "profit_margin": 19.5,
        "avg_delivery_time": 15,
        "transport_mode": "Sea Freight"
    },
    {
        "id": 5,
        "origin": "Amsterdam",
        "destination": "Johannesburg",
        "volume": 543,
        "avg_cost": 25600,
        "on_time_percentage": 91,
        "revenue": 3250000,
        "profit_margin": 31.2,
        "avg_delivery_time": 4,
        "transport_mode": "Air Freight"
    }
]

@router.get("/metrics")
async def get_analytics_metrics(timeframe: Optional[str] = "30d"):
    """Get key analytics metrics"""
    metrics = MOCK_METRICS.copy()
    
    # Simulate different values based on timeframe
    if timeframe == "7d":
        metrics["total_shipments"] = int(metrics["total_shipments"] * 0.2)
        metrics["total_revenue"] = int(metrics["total_revenue"] * 0.2)
    elif timeframe == "90d":
        metrics["total_shipments"] = int(metrics["total_shipments"] * 3.0)
        metrics["total_revenue"] = int(metrics["total_revenue"] * 3.0)
    elif timeframe == "1y":
        metrics["total_shipments"] = int(metrics["total_shipments"] * 12)
        metrics["total_revenue"] = int(metrics["total_revenue"] * 12)
    
    return {
        "status": "success",
        "data": metrics,
        "timeframe": timeframe,
        "last_updated": datetime.now().isoformat()
    }

@router.get("/routes")
async def get_route_performance(
    sort_by: Optional[str] = "volume",
    order: Optional[str] = "desc",
    limit: Optional[int] = None
):
    """Get route performance analytics"""
    routes = MOCK_ROUTE_PERFORMANCE.copy()
    
    # Sort routes
    reverse = order == "desc"
    if sort_by in ["volume", "revenue", "profit_margin", "on_time_percentage", "avg_cost"]:
        routes.sort(key=lambda x: x[sort_by], reverse=reverse)
    
    if limit:
        routes = routes[:limit]
    
    return {
        "status": "success",
        "data": routes,
        "total": len(MOCK_ROUTE_PERFORMANCE),
        "sort_by": sort_by,
        "order": order
    }

@router.get("/report/{report_type}")
async def generate_report(
    report_type: str,
    timeframe: Optional[str] = "30d",
    format: Optional[str] = "json"
):
    """Generate analytics report"""
    if report_type not in ["performance", "financial", "operational"]:
        raise HTTPException(status_code=400, detail="Invalid report type")
    
    # Generate report data based on type
    if report_type == "performance":
        report_data = {
            "report_type": "Performance Report",
            "timeframe": timeframe,
            "generated_at": datetime.now().isoformat(),
            "summary": {
                "total_shipments": MOCK_METRICS["total_shipments"],
                "on_time_delivery_rate": MOCK_METRICS["on_time_delivery_rate"],
                "avg_delivery_time": MOCK_METRICS["avg_delivery_time"],
                "customer_satisfaction": MOCK_METRICS["customer_satisfaction"],
                "damage_rate": MOCK_METRICS["damage_rate"]
            },
            "route_performance": MOCK_ROUTE_PERFORMANCE[:5],
            "key_insights": [
                "On-time delivery rate improved by 2.3% this month",
                "Cape Town to Hamburg route shows strongest performance", 
                "Air freight routes maintain higher customer satisfaction",
                "Overall delivery times decreased by 1.2 days on average"
            ]
        }
    elif report_type == "financial":
        report_data = {
            "report_type": "Financial Report",
            "timeframe": timeframe,
            "generated_at": datetime.now().isoformat(),
            "summary": {
                "total_revenue": MOCK_METRICS["total_revenue"],
                "profit_margin": MOCK_METRICS["profit_margin"],
                "cost_per_kg": MOCK_METRICS["cost_per_kg"],
                "fuel_costs": 650000,
                "operational_costs": 1250000
            },
            "revenue_by_route": [
                {"route": "Cape Town - Hamburg", "revenue": 2450000, "profit": 575750},
                {"route": "Amsterdam - Johannesburg", "revenue": 3250000, "profit": 1014000},
                {"route": "Johannesburg - Frankfurt", "revenue": 2890000, "profit": 814580}
            ],
            "cost_breakdown": {
                "fuel": 650000,
                "labor": 450000,
                "maintenance": 200000,
                "insurance": 150000,
                "other": 300000
            }
        }
    else:  # operational
        report_data = {
            "report_type": "Operational Report",
            "timeframe": timeframe,
            "generated_at": datetime.now().isoformat(),
            "summary": {
                "total_shipments": MOCK_METRICS["total_shipments"],
                "avg_delivery_time": MOCK_METRICS["avg_delivery_time"],
                "fuel_efficiency": MOCK_METRICS["fuel_efficiency"],
                "fleet_utilization": 87.3,
                "driver_efficiency": 91.8
            },
            "operational_metrics": {
                "sea_freight_volume": 832,
                "air_freight_volume": 298,
                "road_transport_volume": 117,
                "average_load_factor": 89.2,
                "port_dwell_time": 2.4
            },
            "efficiency_trends": [
                {"month": "Jan", "efficiency": 85.2},
                {"month": "Feb", "efficiency": 87.1},
                {"month": "Mar", "efficiency": 88.9},
                {"month": "Apr", "efficiency": 90.3},
                {"month": "May", "efficiency": 91.8},
                {"month": "Jun", "efficiency": 92.5}
            ]
        }
    
    return {
        "status": "success",
        "data": report_data
    }

@router.get("/export/{export_type}")
async def export_analytics_data(
    export_type: str,
    format: Optional[str] = "csv",
    timeframe: Optional[str] = "30d"
):
    """Export analytics data in various formats"""
    if export_type not in ["routes", "metrics", "shipments"]:
        raise HTTPException(status_code=400, detail="Invalid export type")
    
    if format not in ["csv", "json", "xlsx"]:
        raise HTTPException(status_code=400, detail="Invalid format")
    
    # Get data based on export type
    if export_type == "routes":
        data = MOCK_ROUTE_PERFORMANCE
        filename = f"route_analytics_{timeframe}.{format}"
    elif export_type == "metrics":
        data = [MOCK_METRICS]
        filename = f"metrics_{timeframe}.{format}"
    else:
        # Mock shipment data for export
        data = [
            {"id": i, "tracking_id": f"SH-2025-{i:03d}", "origin": "Cape Town", "destination": "Hamburg", 
             "status": "delivered", "cost": 15680, "delivery_time": 14}
            for i in range(1, 101)
        ]
        filename = f"shipments_{timeframe}.{format}"
    
    if format == "json":
        content = json.dumps(data, indent=2)
        media_type = "application/json"
    elif format == "csv":
        # Simple CSV conversion
        if data:
            headers = list(data[0].keys())
            csv_content = ",".join(headers) + "\n"
            for row in data:
                csv_content += ",".join(str(row.get(h, "")) for h in headers) + "\n"
            content = csv_content
        else:
            content = ""
        media_type = "text/csv"
    else:  # xlsx - simplified as CSV for now
        if data:
            headers = list(data[0].keys())
            csv_content = ",".join(headers) + "\n"
            for row in data:
                csv_content += ",".join(str(row.get(h, "")) for h in headers) + "\n"
            content = csv_content
        else:
            content = ""
        media_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    
    # Create streaming response
    return StreamingResponse(
        io.StringIO(content),
        media_type=media_type,
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.get("/charts/cost-analysis")
async def get_cost_analysis_chart(timeframe: Optional[str] = "30d"):
    """Get cost analysis chart data"""
    return {
        "status": "success",
        "data": {
            "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            "datasets": [
                {
                    "label": "Transport Costs (ZAR)",
                    "data": [145000, 152000, 148000, 156000, 151000, 149000],
                    "borderColor": "#ef4444",
                    "backgroundColor": "rgba(239, 68, 68, 0.1)"
                },
                {
                    "label": "Fuel Costs (ZAR)",
                    "data": [65000, 68000, 62000, 71000, 67000, 64000],
                    "borderColor": "#f59e0b", 
                    "backgroundColor": "rgba(245, 158, 11, 0.1)"
                }
            ]
        }
    }

@router.get("/charts/route-performance")
async def get_route_performance_chart():
    """Get route performance chart data"""
    return {
        "status": "success",
        "data": {
            "labels": ["CPT-HAM", "DBN-ROT", "JHB-FRA", "BER-CPT", "AMS-JHB"],
            "datasets": [{
                "label": "On-Time Performance (%)",
                "data": [92, 89, 94, 86, 91],
                "backgroundColor": ["#10b981", "#f59e0b", "#10b981", "#ef4444", "#10b981"]
            }]
        }
    }
