import torch
import torch.nn as nn
from typing import Dict, Any, Optional
import numpy as np

class PredictionModel:
    """Base class for ML prediction models"""
    
    def __init__(self, model_path: Optional[str] = None):
        self.model = None
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model_path = model_path
        self.load_model()
    
    def load_model(self):
        """Load the trained model"""
        try:
            if self.model_path and torch.cuda.is_available():
                self.model = torch.load(self.model_path)
            elif self.model_path:
                self.model = torch.load(self.model_path, map_location=torch.device('cpu'))
            else:
                self.model = self._create_default_model()
            
            self.model.to(self.device)
            self.model.eval()
            
        except Exception as e:
            print(f"Error loading model: {e}")
            self.model = self._create_default_model()
    
    def _create_default_model(self):
        """Create a default model architecture"""
        # This should be overridden by specific model implementations
        return nn.Sequential(
            nn.Linear(10, 50),
            nn.ReLU(),
            nn.Linear(50, 2)
        )
    
    def predict(self, input_data: np.ndarray) -> Dict[str, Any]:
        """Make prediction on input data"""
        try:
            with torch.no_grad():
                input_tensor = torch.tensor(input_data, dtype=torch.float32).to(self.device)
                predictions = self.model(input_tensor)
                probabilities = torch.softmax(predictions, dim=-1)
                
                return {
                    "success": True,
                    "predictions": predictions.cpu().numpy(),
                    "probabilities": probabilities.cpu().numpy(),
                    "confidence": float(torch.max(probabilities))
                }
                
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def preprocess_input(self, raw_input: Any) -> np.ndarray:
        """Preprocess raw input for the model"""
        raise NotImplementedError("Subclasses should implement this method")