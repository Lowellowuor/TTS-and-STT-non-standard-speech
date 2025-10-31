from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime # <-- Added this import

app = FastAPI(
    title="Nairobo Speech API",
    description="Backend API for non-standard speech TTS and STT",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Nairobo Speech API", "status": "running"}

# This is the FIX: Adding the /api/health endpoint the client is requesting
@app.get("/api/health")
async def api_health_check():
    """Standard health check endpoint expected by the client."""
    return {
        "status": "OK", 
        "service": "speech-api",
        "timestamp": datetime.now().isoformat(),
        "message": "Backend is running!"
    }

# Add routes with error handling
try:
    from app.api.routes import stt
    app.include_router(stt.router, prefix="/api/v1/stt", tags=["STT"])
    print("✅ STT routes loaded successfully")
except Exception as e:
    print(f"⚠️ STT routes not loaded: {e}")

try:
    from app.api.routes import tts
    app.include_router(tts.router, prefix="/api/v1/tts", tags=["TTS"])
    print("✅ TTS routes loaded successfully")
except Exception as e:
    print(f"⚠️ TTS routes not loaded: {e}")

try:
    from app.api.routes import enhancement
    app.include_router(enhancement.router, prefix="/api/v1/enhance", tags=["Enhancement"])
    print("✅ Enhancement routes loaded successfully")
except Exception as e:
    print(f"⚠️ Enhancement routes not loaded: {e}")

try:
    from app.api.routes import emergency
    app.include_router(emergency.router, prefix="/api/v1/emergency", tags=["Emergency"])
    print("✅ Emergency routes loaded successfully")
except Exception as e:
    print(f"⚠️ Emergency routes not loaded: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
