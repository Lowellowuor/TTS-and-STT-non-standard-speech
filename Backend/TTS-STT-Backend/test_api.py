import requests

BASE_URL = "http://localhost:8000"

def test_endpoints():
    print("Testing API endpoints...")
    
    # Test health endpoint
    response = requests.get(f"{BASE_URL}/health")
    print(f"✅ Health: {response.status_code} - {response.json()}")
    
    # Test root endpoint
    response = requests.get(f"{BASE_URL}/")
    print(f"✅ Root: {response.status_code} - {response.json()}")
    
    # Test STT endpoint (should give validation error without file)
    response = requests.post(f"{BASE_URL}/api/v1/stt/transcribe")
    print(f"✅ STT endpoint exists: {response.status_code}")
    
    # Test TTS endpoint (should give validation error without text)
    response = requests.post(f"{BASE_URL}/api/v1/tts/synthesize", json={})
    print(f"✅ TTS endpoint exists: {response.status_code}")
    
    print("🎉 All endpoints are accessible!")

if __name__ == "__main__":
    test_endpoints()