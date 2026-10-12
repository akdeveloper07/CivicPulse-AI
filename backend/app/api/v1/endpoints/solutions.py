from typing import List, Optional
from datetime import datetime, timezone
from pydantic import BaseModel, Field
from fastapi import APIRouter, status

router = APIRouter()


class EmergencyAlertCreate(BaseModel):
    hazard_type: str = "Live Wire / Electrocution"
    severity: str = "Immediate Danger to Life"
    location: str = "Anna Nagar 2nd Avenue, near Roundtana"
    dispatched_agencies: Optional[List[str]] = Field(default_factory=lambda: [
        "TANGEDCO Feeder Quick Reaction", "TN Fire & Rescue 101", "GCC Disaster Desk"
    ])
    reported_by: Optional[str] = "Citizen via Emergency Desk"
    eta_emergency_crew: Optional[str] = "4 mins"
    status: Optional[str] = "Active Alert"


class EmergencyAlertOut(EmergencyAlertCreate):
    id: str


# In-memory storage for active emergency incidents
_EMERGENCY_ALERTS: List[dict] = [
    {
        "id": "sos-991",
        "hazard_type": "Live Wire / Electrocution",
        "severity": "Immediate Danger to Life",
        "location": "12th Main Road, near Children Playground, Anna Nagar",
        "dispatched_agencies": [
            "TANGEDCO Quick Reaction Team",
            "GCTP Police Beat #4",
            "GCC Disaster Wing"
        ],
        "reported_by": "Citizen via 1-Tap SOS Desk",
        "eta_emergency_crew": "4 Minutes",
        "status": "Containment in Progress"
    }
]


@router.get("/emergency-alerts", response_model=List[EmergencyAlertOut])
def list_emergency_alerts():
    """Retrieve active emergency civic hazards and alarms."""
    return _EMERGENCY_ALERTS


@router.post("/emergency-alerts", response_model=EmergencyAlertOut, status_code=status.HTTP_201_CREATED)
def trigger_emergency_alert(alert_in: EmergencyAlertCreate):
    """Trigger a new 1-tap emergency civic hazard alert and multi-agency dispatch."""
    new_alert = {
        "id": f"sos-{int(datetime.now(timezone.utc).timestamp())}",
        "hazard_type": alert_in.hazard_type,
        "severity": alert_in.severity,
        "location": alert_in.location,
        "dispatched_agencies": alert_in.dispatched_agencies or [
            "TANGEDCO Feeder Quick Reaction", "TN Fire & Rescue 101", "GCC Disaster Desk"
        ],
        "reported_by": alert_in.reported_by or "Citizen via Emergency Desk",
        "eta_emergency_crew": alert_in.eta_emergency_crew or "4 mins",
        "status": alert_in.status or "Active Alert"
    }
    _EMERGENCY_ALERTS.insert(0, new_alert)
    return new_alert


@router.post("/nearby-issues/{issue_id}/support")
def support_nearby_issue(issue_id: str):
    """Upvote/support an existing issue to prevent duplicate ticket generation."""
    return {"success": True, "issue_id": issue_id, "message": "Support recorded"}
