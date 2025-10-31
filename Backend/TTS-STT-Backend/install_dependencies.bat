@echo off
echo ========================================
echo Installing TTS-STT Backend Dependencies
echo ========================================
echo.

echo Batch 1: Core web framework...
pip install fastapi==0.104.1 uvicorn==0.24.0 python-multipart==0.0.6
if %errorlevel% neq 0 (
    echo ? Batch 1 failed!
    pause
    exit /b 1
)

echo.
echo Batch 2: Data validation and security...
pip install pydantic==2.5.0 pydantic-settings==2.1.0 python-jose==3.3.0 passlib==1.7.4 bcrypt==4.0.1
if %errorlevel% neq 0 (
    echo ? Batch 2 failed!
    pause
    exit /b 1
)

echo.
echo Batch 3: Core ML - PyTorch (this might take time)...
pip install torch==2.1.0 torchaudio==2.1.0 --index-url https://download.pytorch.org/whl/cu118
if %errorlevel% neq 0 (
    echo ? Batch 3 failed!
    echo Trying CPU-only version...
    pip install torch==2.1.0 torchaudio==2.1.0 --index-url https://download.pytorch.org/whl/cpu
)

echo.
echo Batch 4: ML - Transformers and audio...
pip install transformers==4.35.0 librosa==0.10.1 soundfile==0.12.1
if %errorlevel% neq 0 (
    echo ? Batch 4 failed!
    pause
    exit /b 1
)

echo.
echo Batch 5: Scientific computing...
pip install numpy==1.24.3 scipy==1.11.3
if %errorlevel% neq 0 (
    echo ? Batch 5 failed!
    pause
    exit /b 1
)

echo.
echo Batch 6: Audio processing...
pip install pydub==0.25.1 webrtcvad==2.0.10
if %errorlevel% neq 0 (
    echo ? Batch 6 failed!
    pause
    exit /b 1
)

echo.
echo Batch 7: Utilities...
pip install python-dotenv==1.0.0
if %errorlevel% neq 0 (
    echo ? Batch 7 failed!
    pause
    exit /b 1
)

echo.
echo Batch 8: Database (optional)...
pip install sqlalchemy==2.0.23 alembic==1.12.1 psycopg2-binary==2.9.9
if %errorlevel% neq 0 (
    echo ??  Batch 8 failed but continuing (database packages optional)
)

echo.
echo Batch 9: Evaluation...
pip install jiwer==2.5.1 rapidfuzz==3.5.2 pytest==7.4.3 pytest-asyncio==0.21.1
if %errorlevel% neq 0 (
    echo ??  Batch 9 failed but continuing (evaluation packages optional)
)

echo.
echo Batch 10: Communication (optional)...
pip install twilio==8.10.0 python-http-client==3.3.7
if %errorlevel% neq 0 (
    echo ??  Batch 10 failed but continuing (communication packages optional)
)

echo.
echo ========================================
echo ? All batches completed successfully!
echo ========================================
echo.
pause
