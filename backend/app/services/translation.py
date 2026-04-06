"""
Translation Service - Core Translation Engine
Dictionary-based translation with letter fallback
"""

from typing import List, Optional, Dict
import logging
from backend.app.models.database import get_database
from backend.app.models.schemas import SignElement, DictionaryWord

logger = logging.getLogger(__name__)


class TranslationService:
    """
    Translation service for converting Arabic text to sign language.
    
    Translation Strategy:
    1. Check if complete phrase exists in dictionary -> use video
    2. Check if individual words exist in dictionary -> use videos
    3. For unknown words -> split into letters -> use letter videos
    """
    
    def __init__(self):
        self.db = get_database()
        self._word_cache: Dict[str, Optional[Dict]] = {}
        self._letter_cache: Dict[str, Optional[Dict]] = {}
        
    async def load_dictionary(self):
        """Load dictionary into memory cache for performance."""
        try:
            # Load words
            async for word in self.db.words.find():
                self._word_cache[word["word"].lower()] = {
                    "video_path": word.get("video_path"),
                    "translation": word.get("translation"),
                    "name": word.get("word")
                }
            
            # Load letters
            async for letter in self.db.letters.find():
                self._letter_cache[letter["letter"]] = {
                    "video_path": letter.get("video_path"),
                    "name": letter.get("name")
                }
            
            logger.info(f"Loaded {len(self._word_cache)} words and {len(self._letter_cache)} letters into cache")
            
        except Exception as e:
            logger.error(f"Failed to load dictionary: {e}")
    
    def normalize_text(self, text: str) -> str:
        """Normalize Arabic text for processing."""
        # Remove diacritics (tashkeel)
        arabic_diacritics = re.compile(r'[\u064B-\u0652\u0670]')
        text = arabic_diacritics.sub('', text)
        
        # Normalize alef variants
        text = text.replace('إ', 'ا').replace('أ', 'ا').replace('آ', 'ا')
        
        # Normalize ya
        text = text.replace('ى', 'ي')
        
        # Remove extra whitespace
        text = ' '.join(text.split())
        
        return text
    
    async def translate(self, text: str, split_unknown: bool = True) -> List[SignElement]:
        """
        Translate text to sign language elements.
        
        Args:
            text: Input Arabic text
            split_unknown: Whether to split unknown words into letters
            
        Returns:
            List of SignElement objects
        """
        if not text:
            return []
        
        # Normalize text
        normalized_text = self.normalize_text(text)
        
        signs = []
        
        # Check if complete phrase exists
        if normalized_text.lower() in self._word_cache:
            word_data = self._word_cache[normalized_text.lower()]
            signs.append(SignElement(
                type="word",
                value=normalized_text,
                video_path=word_data.get("video_path"),
                display_name=word_data.get("name") or normalized_text
            ))
            return signs
        
        # Split into words
        words = normalized_text.split()
        
        for word in words:
            word_lower = word.lower()
            
            # Check if word exists in dictionary
            if word_lower in self._word_cache:
                word_data = self._word_cache[word_lower]
                signs.append(SignElement(
                    type="word",
                    value=word,
                    video_path=word_data.get("video_path"),
                    display_name=word_data.get("name") or word
                ))
            elif split_unknown:
                # Split word into letters
                letter_signs = self._split_into_letters(word)
                signs.extend(letter_signs)
            else:
                # Mark as unknown
                signs.append(SignElement(
                    type="unknown",
                    value=word,
                    video_path=None,
                    display_name=f"[{word}]"
                ))
        
        return signs
    
    def _split_into_letters(self, word: str) -> List[SignElement]:
        """Split a word into individual Arabic letters."""
        signs = []
        arabic_letters = set('ابتثجحخدذرزسشصضطظعغفقكلمنهوي')
        
        for char in word:
            if char in arabic_letters:
                letter_data = self._letter_cache.get(char, {})
                signs.append(SignElement(
                    type="letter",
                    value=char,
                    video_path=letter_data.get("video_path"),
                    display_name=letter_data.get("name") or char
                ))
        
        return signs
    
    async def get_word(self, word: str) -> Optional[DictionaryWord]:
        """Get word details from dictionary."""
        result = await self.db.words.find_one({"word": word})
        if result:
            result.pop("_id", None)
            return DictionaryWord(**result)
        return None
    
    async def search_words(self, query: str, limit: int = 20) -> List[DictionaryWord]:
        """Search words in dictionary."""
        results = []
        cursor = self.db.words.find(
            {"$text": {"$search": query}},
            {"score": {"$meta": "textScore"}}
        ).sort([("score", {"$meta": "textScore"})]).limit(limit)
        
        async for doc in cursor:
            doc.pop("_id", None)
            results.append(DictionaryWord(**doc))
        
        return results
    
    async def get_letter(self, letter: str) -> Optional[Dict]:
        """Get letter details from dictionary."""
        return await self.db.letters.find_one({"letter": letter})
    
    async def get_all_letters(self) -> List[Dict]:
        """Get all Arabic letters."""
        letters = []
        async for letter in self.db.letters.find():
            letter.pop("_id", None)
            letters.append(letter)
        return letters
    
    async def get_all_words(self, category: Optional[str] = None) -> List[DictionaryWord]:
        """Get all words, optionally filtered by category."""
        query = {"category": category} if category else {}
        words = []
        
        async for word in self.db.words.find(query):
            word.pop("_id", None)
            words.append(DictionaryWord(**word))
        
        return words
    
    def clear_cache(self):
        """Clear the translation cache."""
        self._word_cache.clear()
        self._letter_cache.clear()
        logger.info("Translation cache cleared")


# Global translation service instance
translation_service = TranslationService()


import re  # Import re for text normalization
