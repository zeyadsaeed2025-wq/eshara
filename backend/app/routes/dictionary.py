"""
Dictionary API Routes
GET /dictionary endpoints
"""

from fastapi import APIRouter, HTTPException, status, Query
from fastapi.responses import JSONResponse
from typing import Optional
import logging

from backend.app.models.schemas import (
    DictionaryResponse, 
    DictionaryWord,
    DictionaryLetter,
    ErrorResponse
)
from backend.app.services.translation import translation_service

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get(
    "/dictionary",
    response_model=DictionaryResponse,
    summary="Get Full Dictionary",
    description="Retrieve all words and letters from the dictionary"
)
async def get_dictionary(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(50, ge=1, le=100, description="Items per page"),
    category: Optional[str] = Query(None, description="Filter by category")
):
    """
    Get dictionary content with pagination.
    
    - **page**: Page number (starting from 1)
    - **page_size**: Number of items per page
    - **category**: Optional category filter
    """
    try:
        # Get words
        words = await translation_service.get_all_words(category=category)
        
        # Get letters
        letters_raw = await translation_service.get_all_letters()
        letters = [DictionaryLetter(**l) for l in letters_raw]
        
        # Paginate words
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        paginated_words = words[start_idx:end_idx]
        
        return DictionaryResponse(
            words=paginated_words,
            letters=letters,
            total_count=len(words) + len(letters),
            page=page,
            page_size=page_size
        )
        
    except Exception as e:
        logger.error(f"Dictionary fetch error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get(
    "/dictionary/words",
    response_model=list[DictionaryWord],
    summary="Get All Words",
    description="Retrieve all words from the dictionary"
)
async def get_all_words(
    category: Optional[str] = Query(None, description="Filter by category")
):
    """Get all dictionary words, optionally filtered by category."""
    try:
        words = await translation_service.get_all_words(category=category)
        return words
    except Exception as e:
        logger.error(f"Words fetch error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get(
    "/dictionary/letters",
    response_model=list[DictionaryLetter],
    summary="Get All Letters",
    description="Retrieve all Arabic letters from the dictionary"
)
async def get_all_letters():
    """Get all Arabic letters."""
    try:
        letters_raw = await translation_service.get_all_letters()
        return [DictionaryLetter(**l) for l in letters_raw]
    except Exception as e:
        logger.error(f"Letters fetch error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get(
    "/dictionary/word/{word}",
    response_model=DictionaryWord,
    summary="Get Specific Word",
    description="Get details for a specific word"
)
async def get_word(word: str):
    """Get details for a specific word."""
    try:
        word_data = await translation_service.get_word(word)
        if not word_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Word '{word}' not found in dictionary"
            )
        return word_data
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Word fetch error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get(
    "/dictionary/letter/{letter}",
    summary="Get Specific Letter",
    description="Get details for a specific Arabic letter"
)
async def get_letter(letter: str):
    """Get details for a specific Arabic letter."""
    try:
        letter_data = await translation_service.get_letter(letter)
        if not letter_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Letter '{letter}' not found in dictionary"
            )
        letter_data.pop("_id", None)
        return letter_data
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Letter fetch error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get(
    "/dictionary/search",
    response_model=list[DictionaryWord],
    summary="Search Dictionary",
    description="Search for words in the dictionary"
)
async def search_dictionary(
    q: str = Query(..., min_length=1, description="Search query")
):
    """Search for words in the dictionary."""
    try:
        results = await translation_service.search_words(query=q)
        return results
    except Exception as e:
        logger.error(f"Search error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get(
    "/dictionary/categories",
    summary="Get Word Categories",
    description="Get list of all word categories"
)
async def get_categories():
    """Get all word categories."""
    categories = [
        "greeting",
        "expression", 
        "question",
        "basic",
        "response",
        "identity",
        "request"
    ]
    return {"categories": categories}
