# models/database.py
from sqlalchemy import create_engine, Column, String, DateTime, Text, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

Base = declarative_base()

class TranscriptionLog(Base):
    __tablename__ = "transcription_logs"
    
    id = Column(String, primary_key=True)
    audio_filename = Column(String)
    transcription = Column(Text)
    confidence = Column(Float)
    emergency_detected = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class TTSSynthesisLog(Base):
    __tablename__ = "tts_synthesis_logs"
    
    id = Column(String, primary_key=True)
    text = Column(Text)
    voice_id = Column(String)
    duration = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)