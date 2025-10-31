from fastapi import APIRouter, HTTPException
from app.api.models.requests import EmergencyRequest
from app.api.models.responses import EmergencyResponse
from services.emergency_service import EmergencyService

router = APIRouter()
emergency_service = EmergencyService()

@router.post("/handle", response_model=EmergencyResponse)
async def handle_emergency(request: EmergencyRequest):
    """Handle emergency situation detection and response"""
    try:
        result = emergency_service.handle_emergency(request.transcription, request.location)
        
        if not result["success"]:
            raise HTTPException(status_code=400, detail=result["error"])
        
        return EmergencyResponse(
            success=True,
            emergency_detected=result["emergency_detected"],
            alert_sent=result.get("alert_sent", False),
            contacts_notified=result.get("contacts_notified", []),
            message=result.get("message", "")
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
