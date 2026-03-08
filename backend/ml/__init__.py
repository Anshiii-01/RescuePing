"""
Advanced ML Module for Rescue Ping
Implements ensemble flood forecasting, anomaly detection, and smart alerts

Hackathon Features:
- Hydrological simulation with watershed model
- LSTM time-series prediction for river levels
- Random Forest classification for flood/no-flood
- India-specific river support (Cauvery, Vrishabhavathi, Brahmaputra)
"""

from .ensemble_predictor import EnsembleFloodPredictor
from .anomaly_detector import AnomalyDetector
from .smart_alerts import SmartAlertEngine

# Hackathon flood forecasting models
try:
    from .lstm_flood_model import LSTMFloodModel, FloodLevelPredictor
    from .rf_flood_classifier import RandomForestFloodClassifier, HybridFloodPredictor
    HACKATHON_MODELS_AVAILABLE = True
except ImportError:
    HACKATHON_MODELS_AVAILABLE = False

__all__ = [
    'EnsembleFloodPredictor',
    'AnomalyDetector', 
    'SmartAlertEngine',
    'LSTMFloodModel',
    'FloodLevelPredictor',
    'RandomForestFloodClassifier',
    'HybridFloodPredictor',
    'HACKATHON_MODELS_AVAILABLE',
]
