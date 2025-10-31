from fastapi import APIRouter, HTTPException
from app.api.models.requests import EnhancementRequest
from app.api.models.responses import EnhancementResponse
from services.enhancement_service import EnhancementService

router = APIRouter()
enhancement_service = EnhancementService()

@router.post("/text", response_model=EnhancementResponse)
async def enhance_text(request: EnhancementRequest):
    """Enhance text for clarity and readability"""
    try:
        result = enhancement_service.enhance_text(request.text, request.enhancement_type)
        
        if not result["success"]:
            raise HTTPException(status_code=400, detail=result["error"])
        
        return EnhancementResponse(
            success=True,
            original_text=result["original_text"],
            enhanced_text=result["enhanced_text"],
            enhancement_type=result["enhancement_type"],
            improvements=result.get("improvements", {})
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
