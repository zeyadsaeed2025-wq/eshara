"""
Speech Recognition API Routes
POST /speech-to-text endpoint
"""

from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse
import logging

from backend.app.models.schemas import SpeechToTextRequest, SpeechToTextResponse, ErrorResponse
from backend.app.services.speech import speech_service

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post(
    "/speech-to-text",
    response_model=SpeechToTextResponse,
    responses={
        200: {"model": SpeechToTextResponse},
        400: {"model": ErrorResponse},
        500: {"model": ErrorResponse}
    },
    summary="Convert Speech to Text",
    description="Convert Arabic speech audio to text using Whisper AI"
)
async def speech_to_text(request: SpeechToTextRequest):
    """
    Convert speech audio to text.
    
    - **audio_data**: Base64 encoded audio file
    - **language**: Source language (default: Arabic)
    - **sample_rate**: Audio sample rate (default: 16000)
    """
    try:
        if not request.audio_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Audio data is required"
            )
        
        logger.info(f"Processing speech-to-text request (language: {request.language})")
        
        # Process speech recognition
        result = await speech_service.recognize_speech(
            audio_data=request.audio_data,
            language=request.language.value,
            sample_rate=request.sample_rate
        )
        
        if "error" in result:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=result["error"]
            )
        
        # Check if model is in mock mode
        if result.get("status") == "mock_mode":
            logger.warning("Speech service is running in mock mode - Whisper not loaded")
        
        return SpeechToTextResponse(
            text=result["text"],
            language=result["language"],
            confidence=result["confidence"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Speech-to-text error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Speech recognition failed: {str(e)}"
        )


@router.get(
    "/speech-status",
    summary="Check Speech Service Status",
    description="Check if the speech recognition service is ready"
)
async def speech_status():
    """Check if speech recognition service is available."""
    return {
        "service": "speech_recognition",
        "status": "ready" if speech_service.is_model_loaded() else "mock_mode",
        "model_loaded": speech_service.is_model_loaded()
    }
