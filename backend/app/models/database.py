"""
Database Connection and Configuration
MongoDB connection management
"""

from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional
import logging
import os

logger = logging.getLogger(__name__)

# MongoDB Configuration
MONGO_HOST = os.getenv("MONGO_HOST", "localhost")
MONGO_PORT = int(os.getenv("MONGO_PORT", 27017))
MONGO_DB = os.getenv("MONGO_DB", "sign_language_db")
MONGO_URL = f"mongodb://{MONGO_HOST}:{MONGO_PORT}"

# Global database client
client: Optional[AsyncIOMotorClient] = None
db = None


async def connect_to_mongo():
    """Connect to MongoDB."""
    global client, db
    
    try:
        client = AsyncIOMotorClient(MONGO_URL)
        db = client[MONGO_DB]
        
        # Verify connection
        await client.admin.command('ping')
        logger.info(f"Connected to MongoDB at {MONGO_URL}")
        
        # Initialize collections with indexes
        await initialize_indexes()
        
        # Seed initial data if needed
        await seed_initial_data()
        
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise


async def close_mongo_connection():
    """Close MongoDB connection."""
    global client
    
    if client:
        client.close()
        logger.info("MongoDB connection closed")


async def initialize_indexes():
    """Create database indexes for performance."""
    global db
    
    # Words collection indexes
    await db.words.create_index("word", unique=True)
    await db.words.create_index("category")
    await db.words.create_index([("word", "text"), ("description", "text")])
    
    # Letters collection indexes
    await db.letters.create_index("letter", unique=True)
    await db.letters.create_index("category")
    
    # Translation history indexes
    await db.translation_history.create_index("timestamp")
    await db.translation_history.create_index("source_language")
    
    logger.info("Database indexes initialized")


async def seed_initial_data():
    """Seed initial dictionary data if collections are empty."""
    global db
    
    # Check if data exists
    words_count = await db.words.count_documents({})
    
    if words_count == 0:
        logger.info("Seeding initial dictionary data...")
        
        # Arabic Letters
        arabic_letters = [
            {"letter": "ا", "name": "ألف", "category": "letter", "video_path": "/media/videos/letters/alif.mp4"},
            {"letter": "ب", "name": "باء", "category": "letter", "video_path": "/media/videos/letters/ba.mp4"},
            {"letter": "ت", "name": "تاء", "category": "letter", "video_path": "/media/videos/letters/ta.mp4"},
            {"letter": "ث", "name": "ثاء", "category": "letter", "video_path": "/media/videos/letters/tha.mp4"},
            {"letter": "ج", "name": "جيم", "category": "letter", "video_path": "/media/videos/letters/jeem.mp4"},
            {"letter": "ح", "name": "حاء", "category": "letter", "video_path": "/media/videos/letters/ha.mp4"},
            {"letter": "خ", "name": "خاء", "category": "letter", "video_path": "/media/videos/letters/kha.mp4"},
            {"letter": "د", "name": "دال", "category": "letter", "video_path": "/media/videos/letters/dal.mp4"},
            {"letter": "ذ", "name": "ذال", "category": "letter", "video_path": "/media/videos/letters/dhal.mp4"},
            {"letter": "ر", "name": "راء", "category": "letter", "video_path": "/media/videos/letters/ra.mp4"},
            {"letter": "ز", "name": "زاي", "category": "letter", "video_path": "/media/videos/letters/zay.mp4"},
            {"letter": "س", "name": "سين", "category": "letter", "video_path": "/media/videos/letters/sin.mp4"},
            {"letter": "ش", "name": "شين", "category": "letter", "video_path": "/media/videos/letters/shin.mp4"},
            {"letter": "ص", "name": "صاد", "category": "letter", "video_path": "/media/videos/letters/sad.mp4"},
            {"letter": "ض", "name": "ضاد", "category": "letter", "video_path": "/media/videos/letters/dad.mp4"},
            {"letter": "ط", "name": "طاء", "category": "letter", "video_path": "/media/videos/letters/taa.mp4"},
            {"letter": "ظ", "name": "ظاء", "category": "letter", "video_path": "/media/videos/letters/zaa.mp4"},
            {"letter": "ع", "name": "عين", "category": "letter", "video_path": "/media/videos/letters/ain.mp4"},
            {"letter": "غ", "name": "غين", "category": "letter", "video_path": "/media/videos/letters/ghain.mp4"},
            {"letter": "ف", "name": "فاء", "category": "letter", "video_path": "/media/videos/letters/fa.mp4"},
            {"letter": "ق", "name": "قاف", "category": "letter", "video_path": "/media/videos/letters/qaf.mp4"},
            {"letter": "ك", "name": "كاف", "category": "letter", "video_path": "/media/videos/letters/kaf.mp4"},
            {"letter": "ل", "name": "لام", "category": "letter", "video_path": "/media/videos/letters/lam.mp4"},
            {"letter": "م", "name": "ميم", "category": "letter", "video_path": "/media/videos/letters/meem.mp4"},
            {"letter": "ن", "name": "نون", "category": "letter", "video_path": "/media/videos/letters/noon.mp4"},
            {"letter": "هـ", "name": "هاء", "category": "letter", "video_path": "/media/videos/letters/haa.mp4"},
            {"letter": "و", "name": "واو", "category": "letter", "video_path": "/media/videos/letters/waw.mp4"},
            {"letter": "ي", "name": "ياء", "category": "letter", "video_path": "/media/videos/letters/ya.mp4"},
        ]
        
        await db.letters.insert_many(arabic_letters)
        
        # Common Arabic Words/Phrases
        common_words = [
            {"word": "صباح الخير", "translation": "good_morning", "category": "greeting", 
             "video_path": "/media/videos/words/sabah_al_khair.mp4", "description": "Good morning"},
            {"word": "مساء الخير", "translation": "good_evening", "category": "greeting",
             "video_path": "/media/videos/words/masaa_al_khair.mp4", "description": "Good evening"},
            {"word": "شكراً", "translation": "thank_you", "category": "expression",
             "video_path": "/media/videos/words/shukran.mp4", "description": "Thank you"},
            {"word": "谢谢你", "translation": "thanks", "category": "expression",
             "video_path": "/media/videos/words/shukran.mp4", "description": "Thanks"},
            {"word": "أهلاً", "translation": "hello", "category": "greeting",
             "video_path": "/media/videos/words/ahlan.mp4", "description": "Hello"},
            {"word": "مرحبا", "translation": "welcome", "category": "greeting",
             "video_path": "/media/videos/words/marhaba.mp4", "description": "Welcome"},
            {"word": "مع السلامة", "translation": "goodbye", "category": "greeting",
             "video_path": "/media/videos/words/maa_al_salamah.mp4", "description": "Goodbye"},
            {"word": "نعم", "translation": "yes", "category": "basic",
             "video_path": "/media/videos/words/naam.mp4", "description": "Yes"},
            {"word": "لا", "translation": "no", "category": "basic",
             "video_path": "/media/videos/words/laa.mp4", "description": "No"},
            {"word": "من فضلك", "translation": "please", "category": "expression",
             "video_path": "/media/videos/words/min_fadlak.mp4", "description": "Please"},
            {"word": "كيف حالك", "translation": "how_are_you", "category": "question",
             "video_path": "/media/videos/words/kayf_halak.mp4", "description": "How are you?"},
            {"word": "أنا بخير", "translation": "i_am_fine", "category": "response",
             "video_path": "/media/videos/words/ana_bekhair.mp4", "description": "I am fine"},
            {"word": "أنا لا أفهم", "translation": "i_dont_understand", "category": "expression",
             "video_path": "/media/videos/words/ana_la_afham.mp4", "description": "I don't understand"},
            {"word": "أعتذر", "translation": "sorry", "category": "expression",
             "video_path": "/media/videos/words/aatadir.mp4", "description": "Sorry"},
            {"word": "أنا أعمى", "translation": "i_am_deaf", "category": "identity",
             "video_path": "/media/videos/words/ana_asamm.mp4", "description": "I am deaf"},
            {"word": "أريد المساعدة", "translation": "i_need_help", "category": "request",
             "video_path": "/media/videos/words/ureed_al_musaada.mp4", "description": "I need help"},
            {"word": "أين", "translation": "where", "category": "question",
             "video_path": "/media/videos/words/ayna.mp4", "description": "Where"},
            {"word": "متى", "translation": "when", "category": "question",
             "video_path": "/media/videos/words/mataa.mp4", "description": "When"},
            {"word": "كم", "translation": "how_much", "category": "question",
             "video_path": "/media/videos/words/kam.mp4", "description": "How much"},
            {"word": "ما هذا", "translation": "what_is_this", "category": "question",
             "video_path": "/media/videos/words/ma_hadha.mp4", "description": "What is this"},
        ]
        
        await db.words.insert_many(common_words)
        
        logger.info(f"Seeded {len(arabic_letters)} letters and {len(common_words)} words")


def get_database():
    """Get database instance."""
    return db
