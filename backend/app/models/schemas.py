"""
Pydantic Models for Request/Response Validation
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime
from enum import Enum


class LanguageEnum(str, Enum):
    """Supported languages."""
    ARABIC = "ar"
    ENGLISH = "en"


class SpeechToTextRequest(BaseModel):
    """Request model for speech to text conversion."""
    audio_data: str = Field(..., description="Base64 encoded audio data")
    language: LanguageEnum = Field(default=LanguageEnum.ARABIC, description="Source language")
    sample_rate: int = Field(default=16000, description="Audio sample rate")


class SpeechToTextResponse(BaseModel):
    """Response model for speech to text conversion."""
    text: str = Field(..., description="Recognized text")
    language: str = Field(..., description="Detected language")
    confidence: float = Field(..., description="Recognition confidence score")
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class TranslationRequest(BaseModel):
    """Request model for text translation."""
    text: str = Field(..., description="Text to translate to sign language")
    source_language: LanguageEnum = Field(default=LanguageEnum.ARABIC)
    target_language: str = Field(default="sign_language")
    split_unknown_words: bool = Field(default=True, description="Split unknown words into letters")


class SignElement(BaseModel):
    """Individual sign element in translation."""
    type: str = Field(..., description="Type: 'word' or 'letter'")
    value: str = Field(..., description="The word or letter")
    video_path: Optional[str] = Field(None, description="Path to video file")
    display_name: Optional[str] = Field(None, description="Human readable name")


class TranslationResponse(BaseModel):
    """Response model for translation."""
    original_text: str = Field(..., description="Original input text")
    translated_signs: List[SignElement] = Field(..., description="List of sign elements")
    total_signs: int = Field(..., description="Total number of sign elements")
    translation_mode: str = Field(..., description="How translation was done: 'word' or 'letter'")
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class DictionaryWord(BaseModel):
    """Model for dictionary word entry."""
    word: str = Field(..., description="The word")
    translation: str = Field(..., description="English translation")
    category: str = Field(..., description="Word category")
    video_path: Optional[str] = Field(None, description="Path to sign video")
    description: Optional[str] = Field(None, description="Description")
    usage_examples: Optional[List[str]] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class DictionaryLetter(BaseModel):
    """Model for dictionary letter entry."""
    letter: str = Field(..., description="The Arabic letter")
    name: str = Field(..., description="Letter name in Arabic")
    category: str = Field(..., description="Category (letter)")


class DictionaryResponse(BaseModel):
    """Response model for dictionary queries."""
    words: List[DictionaryWord] = Field(default_factory=list)
    letters: List[DictionaryLetter] = Field(default_factory=list)
    total_count: int = Field(..., description="Total entries")
    page: int = Field(default=1)
    page_size: int = Field(default=50)


class HealthCheckResponse(BaseModel):
    """Health check response model."""
    status: str
    services: Dict[str, str]
    version: str = "1.0.0"


class ErrorResponse(BaseModel):
    """Error response model."""
    error: str = Field(..., description="Error type")
    message: str = Field(..., description="Error message")
    details: Optional[Dict] = Field(None, description="Additional details")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
