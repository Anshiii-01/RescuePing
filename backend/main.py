"""
Rescue Ping - Production FastAPI Backend
Real APIs, Live Data, ML Predictions
"""

from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import logging
import os
import requests
from datetime import datetime, timedelta
import json
from typing import Dict, List, Any, Optional
import asyncio

# Try to import ML packages, but don't fail if they're not available
try:
    import numpy as np
    import pandas as pd
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.preprocessing import StandardScaler
    import joblib
    ML_AVAILABLE = True
except ImportError:
    ML_AVAILABLE = False
    print("⚠️ ML packages not available, using rule-based predictions")

try:
    import sentry_sdk
    from sentry_sdk.integrations.logging import LoggingIntegration
    SENTRY_AVAILABLE = True
except ImportError:
    SENTRY_AVAILABLE = False

# Initialize Sentry if available
if SENTRY_AVAILABLE:
    SENTRY_DSN = os.getenv("SENTRY_DSN", "https://74e92ef112fbc3aed76dd4f0169c70f8@o4510520744673280.ingest.us.sentry.io/4510549672853504")
    
    sentry_logging = LoggingIntegration(
        level=logging.INFO,
        event_level=logging.INFO
    )
    
    sentry_sdk.init(
        dsn=SENTRY_DSN,
        release="rescue-ping-backend@1.0.0",
        environment=os.getenv("ENVIRONMENT", "production"),
        integrations=[sentry_logging],
        traces_sample_rate=1.0,
    )

# Import route modules
from routes import health, weather, predict, alerts, external_apis

# Import advanced ML routes (try/except for graceful degradation)
try:
    from routes import flood_forecast
    ADVANCED_ML_AVAILABLE = True
except ImportError as e:
    print(f"⚠️ Advanced ML routes not available: {e}")
    ADVANCED_ML_AVAILABLE = False

# Import India Rivers flood forecasting routes
try:
    from routes import india_rivers
    INDIA_RIVERS_AVAILABLE = True
except ImportError as e:
    print(f"⚠️ India Rivers routes not available: {e}")
    INDIA_RIVERS_AVAILABLE = False

# Environment variables
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "demo_key")
USGS_EARTHQUAKE_URL = "https://earthquake.usgs.gov/fdsnws/event/1/query"
OPENSTREETMAP_URL = "https://nominatim.openstreetmap.org/reverse"

# Initialize FastAPI app
app = FastAPI(
    title="Rescue Ping API",
    description="Real-time disaster management with live APIs and ML predictions",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logging.error(f"Global exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"message": "Internal Server Error", "detail": str(exc)},
    )

# Middleware for Sentry Profiling
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    response = await call_next(request)
    response.headers["Document-Policy"] = "js-profiling"
    return response

# CORS Configuration - CRITICAL FIX FOR RAILWAY DEPLOYMENT
# Allow all origins with wildcard for public API access
# Railway deployment timestamp: 2025-11-03 04:10:00 UTC
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*")
allowed_origins = [origin.strip() for origin in CORS_ORIGINS.split(",")] if CORS_ORIGINS != "*" else ["*"]

print(f"🔧 CORS Configuration: allow_origins={allowed_origins}")  # Use print before logger is initialized

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=False,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
    expose_headers=["*"]
)

# Add custom middleware to force CORS headers on every response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

class ForceCORSMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "*"
        response.headers["Access-Control-Expose-Headers"] = "*"
        return response

app.add_middleware(ForceCORSMiddleware)

# Logging setup
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# ML Model initialization
ml_model = None
scaler = None

def initialize_ml_model():
    """Initialize ML model for disaster prediction"""
    global ml_model, scaler
    
    if not ML_AVAILABLE:
        logger.info("⚠️ ML packages not available, using rule-based predictions")
        return
    
    try:
        # Create a simple trained model for demonstration
        # In production, load pre-trained model with joblib.load()
        ml_model = RandomForestClassifier(n_estimators=100, random_state=42)
        scaler = StandardScaler()
        
        # Generate synthetic training data for demonstration
        np.random.seed(42)
        n_samples = 1000
        
        # Features: temperature, humidity, wind_speed, pressure, elevation
        X = np.column_stack([
            np.random.normal(25, 10, n_samples),  # temperature
            np.random.normal(60, 20, n_samples),  # humidity
            np.random.normal(10, 5, n_samples),   # wind_speed
            np.random.normal(1013, 15, n_samples), # pressure
            np.random.normal(100, 200, n_samples)  # elevation
        ])
        
        # Target: risk levels (0=low, 1=moderate, 2=high, 3=critical)
        y = np.random.choice([0, 1, 2, 3], n_samples, p=[0.4, 0.3, 0.2, 0.1])
        
        # Train model
        X_scaled = scaler.fit_transform(X)
        ml_model.fit(X_scaled, y)
        
        logger.info("✅ ML Model initialized and trained")
        
    except Exception as e:
        logger.error(f"❌ ML Model initialization failed: {e}")
        ml_model = None
        scaler = None

# Initialize ML model on startup (if available)
if ML_AVAILABLE:
    initialize_ml_model()

# CORS middleware already configured above at line 48-72 - don't add duplicate!
# The app variable is already created at line 31 with CORS enabled

# Register all API routes with proper prefixes
app.include_router(health.router, prefix="/api", tags=["Health Check"])
app.include_router(weather.router, prefix="/api", tags=["Weather"])
app.include_router(predict.router, prefix="/api", tags=["ML Predictions"])
app.include_router(alerts.router, prefix="/api", tags=["Alerts"])
app.include_router(external_apis.router, prefix="/api", tags=["External Data"])

# Register advanced ML routes if available
if ADVANCED_ML_AVAILABLE:
    app.include_router(flood_forecast.router, prefix="/api", tags=["Advanced Flood ML"])

# Register India Rivers flood forecasting routes
if INDIA_RIVERS_AVAILABLE:
    app.include_router(india_rivers.router, tags=["India Flood Forecasting"])

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Rescue Ping API - Disaster Management System  🚀",
        "status": "operational",
        "version": "1.0.2-cors-fixed",  # Updated version to verify deployment
        "timestamp": datetime.now().isoformat(),
        "git_commit": "cors-fix-applied",
        "endpoints": {
            "health": "/api/health",  # FIXED: Added /api prefix
            "docs": "/docs",
            "weather": "/api/weather/{lat}/{lon}",
            "predict": "/api/predict/disaster-risk",
            "alerts": "/api/alerts/active?lat={lat}&lon={lon}",
            "external": "/api/external-data?lat={lat}&lon={lon}"
        },
        "cors_enabled": True,
        "deployment_note": "If you see this version, Railway deployed latest code successfully!"
    }

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize the application on startup"""
    logger.info("🚀 Rescue Ping Backend Starting...")
    logger.info("✅ Server running on http://localhost:8000")
    logger.info("📊 API documentation: http://localhost:8000/docs")
    logger.info("🔧 Interactive docs: http://localhost:8000/redoc")
    logger.info("🌐 CORS enabled for frontend connections")
    logger.info("🔗 All routes registered and ready")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Clean up on shutdown"""
    logger.info("🛑 Rescue Ping Backend Shutting Down...")

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Handle unexpected errors gracefully"""
    logger.error(f"Global exception: {exc}")
    return {
        "error": "Internal server error",
        "detail": "An unexpected error occurred",
        "timestamp": datetime.now().isoformat()
    }

# Main entry point
if __name__ == "__main__":
    logger.info("🚀 Starting Rescue Ping Backend Server...")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
        access_log=True
    )