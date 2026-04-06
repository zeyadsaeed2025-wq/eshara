"""
Translation API Routes
POST /translate endpoint
"""

from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse
import logging

from backend.app.models.schemas import (
    TranslationRequest, 
    TranslationResponse, 
    ErrorResponse
)
from backend.app.services.translation import translation_service

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post(
    "/translate",
    response_model=TranslationResponse,
    responses={
        200: {"model": TranslationResponse},
        400: {"model": ErrorResponse},
        500: {"model": ErrorResponse}
    },
    summary="Translate Text to Sign Language",
    description="Convert Arabic text to sign language video sequence"
)
async def translate_text(request: TranslationRequest):
    """
    Translate Arabic text to sign language.
    
    - **text**: Arabic text to translate
    - **source_language**: Source language (default: Arabic)
    - **split_unknown_words**: Split unknown words into letters (default: True)
    
    Returns a sequence of sign elements (words or letters).
    """
    try:
        if not request.text:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Text is required for translation"
            )
        
        logger.info(f"Translating text: {request.text[:50]}...")
        
        # Perform translation
        signs = await translation_service.translate(
            text=request.text,
            split_unknown=request.split_unknown_words
        )
        
        # Determine translation mode
        if len(signs) == 1 and signs[0].type == "word":
            translation_mode = "word"
        elif all(s.type == "letter" for s in signs):
            translation_mode = "letter"
        else:
            translation_mode = "mixed"
        
        return TranslationResponse(
            original_text=request.text,
            translated_signs=signs,
            total_signs=len(signs),
            translation_mode=translation_mode
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Translation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Translation failed: {str(e)}"
        )


@router.get(
    "/translate/status",
    summary="Check Translation Service Status",
    description="Check if translation service is ready"
)
async def translation_status():
    """Check translation service status."""
    return {
        "service": "translation",
        "status": "ready",
        "cache_loaded": len(translation_service._word_cache) > 0
    }


@router.post(
    "/translate/batch",
    response_model=TranslationResponse,
    summary="Batch Translate Multiple Texts",
    description="Translate multiple texts in a single request"
)
async def batch_translate(texts: list[str]):
    """Batch translate multiple texts."""
    try:
        combined_text = " ".join(texts)
        
        signs = await translation_service.translate(
            text=combined_text,
            split_unknown=True
        )
        
        return TranslationResponse(
            original_text=combined_text,
            translated_signs=signs,
            total_signs=len(signs),
            translation_mode="batch"
        )
        
    except Exception as e:
        logger.error(f"Batch translation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
