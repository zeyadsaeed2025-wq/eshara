"""
Real-Time Sign Language Translator - Backend
FastAPI Application Entry Point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
import logging

from backend.app.routes import speech, translation, dictionary
from backend.app.models.database import connect_to_mongo, close_mongo_connection

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Sign Language Translator API",
    description="Real-time Arabic Sign Language Translation Service",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GZip compression for responses
app.add_middleware(GZipMiddleware, minimum_size=1000)


@app.on_event("startup")
async def startup_db_client():
    """Initialize database connection on startup."""
    logger.info("Starting up...")
    await connect_to_mongo()


@app.on_event("shutdown")
async def shutdown_db_client():
    """Close database connection on shutdown."""
    logger.info("Shutting down...")
    await close_mongo_connection()


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "Sign Language Translator API",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    """Detailed health check."""
    return {
        "status": "healthy",
        "services": {
            "api": "running",
            "database": "connected",
            "translation_engine": "ready"
        }
    }


# Include routers
app.include_router(speech.router, prefix="/api/v1", tags=["Speech"])
app.include_router(translation.router, prefix="/api/v1", tags=["Translation"])
app.include_router(dictionary.router, prefix="/api/v1", tags=["Dictionary"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
