"""
Anomaly Detection Module for Rescue Ping
Implements Isolation Forest and Autoencoder-style detection
for early warning of sudden flood onset
"""

import math
import numpy as np
from typing import Dict, List, Optional, Tuple
from datetime import datetime, timedelta
from collections import deque


class IsolationForestSimulator:
    """
    Simulates Isolation Forest for anomaly detection
    Detects unusual patterns in weather/hydrological data
    """
    
    def __init__(self, contamination: float = 0.1):
        self.contamination = contamination
        self.model_name = "IsolationForest-v2.0"
        
        # Historical baseline statistics (would be learned from data)
        self.baselines = {
            "rainfall_hourly": {"mean": 2.5, "std": 5.0, "max_normal": 25},
            "discharge": {"mean": 150, "std": 80, "max_normal": 500},
            "water_level": {"mean": 2.0, "std": 0.8, "max_normal": 5.0},
            "humidity": {"mean": 65, "std": 15, "max_normal": 95},
            "pressure_change": {"mean": 0, "std": 3, "max_normal": 10}
        }
        
    def detect(self, data: Dict) -> Dict:
        """
        Detect anomalies in input data
        
        Args:
            data: Dict with various sensor readings
            
        Returns:
            Anomaly detection results with scores
        """
        anomaly_scores = {}
        anomalies_detected = []
        
        for feature, values in data.items():
            if feature not in self.baselines:
                continue
                
            baseline = self.baselines[feature]
            
            if isinstance(values, list):
                # Time-series data
                if not values:
                    continue
                recent_values = values[-6:] if len(values) >= 6 else values
                max_val = max(recent_values)
                mean_val = sum(recent_values) / len(recent_values)
                
                # Calculate anomaly score using isolation-style scoring
                z_score_max = abs(max_val - baseline["mean"]) / (baseline["std"] + 0.001)
                z_score_mean = abs(mean_val - baseline["mean"]) / (baseline["std"] + 0.001)
                
                # Anomaly score: higher = more anomalous
                score = (z_score_max * 0.6 + z_score_mean * 0.4) / 4  # Normalize to ~0-1
                score = min(1.0, score)
                
                anomaly_scores[feature] = {
                    "score": round(score, 3),
                    "max_value": round(max_val, 2),
                    "mean_value": round(mean_val, 2),
                    "baseline_mean": baseline["mean"],
                    "is_anomaly": score > 0.6
                }
                
                if score > 0.6:
                    anomalies_detected.append({
                        "feature": feature,
                        "score": round(score, 3),
                        "severity": "high" if score > 0.8 else "medium",
                        "description": f"{feature} showing unusual pattern: {max_val:.1f} vs normal max {baseline['max_normal']}"
                    })
            else:
                # Single value
                z_score = abs(values - baseline["mean"]) / (baseline["std"] + 0.001)
                score = min(1.0, z_score / 4)
                
                anomaly_scores[feature] = {
                    "score": round(score, 3),
                    "value": round(values, 2),
                    "baseline_mean": baseline["mean"],
                    "is_anomaly": score > 0.6
                }
                
                if score > 0.6:
                    anomalies_detected.append({
                        "feature": feature,
                        "score": round(score, 3),
                        "severity": "high" if score > 0.8 else "medium",
                        "description": f"{feature} at {values:.1f}, significantly above normal ({baseline['mean']:.1f})"
                    })
        
        # Calculate overall anomaly score
        if anomaly_scores:
            overall_score = sum(s["score"] for s in anomaly_scores.values()) / len(anomaly_scores)
        else:
            overall_score = 0.0
        
        return {
            "model": self.model_name,
            "overall_anomaly_score": round(overall_score, 3),
            "is_anomalous": overall_score > 0.5,
            "feature_scores": anomaly_scores,
            "anomalies_detected": anomalies_detected,
            "confidence": round(0.8 - (overall_score * 0.2), 2),  # Lower confidence when anomalous
            "timestamp": datetime.now().isoformat()
        }


class AutoencoderSimulator:
    """
    Simulates Autoencoder for reconstruction-based anomaly detection
    Learns normal patterns and flags deviations
    """
    
    def __init__(self, reconstruction_threshold: float = 0.15):
        self.threshold = reconstruction_threshold
        self.model_name = "Autoencoder-FloodAnomaly-v1.0"
        
        # Learned latent space representations (simulated)
        self.normal_patterns = {
            "dry_season": {
                "rainfall": [0, 0, 0, 0, 0.5, 1, 0.5, 0],
                "humidity": [40, 42, 45, 50, 55, 52, 48, 45],
                "pressure": [1013, 1013, 1012, 1012, 1013, 1013, 1014, 1013]
            },
            "monsoon": {
                "rainfall": [5, 8, 15, 20, 25, 18, 10, 8],
                "humidity": [75, 80, 85, 90, 92, 88, 82, 78],
                "pressure": [1008, 1006, 1004, 1002, 1003, 1005, 1007, 1008]
            },
            "pre_flood": {
                "rainfall": [10, 20, 35, 50, 60, 55, 45, 40],
                "humidity": [85, 90, 95, 98, 98, 95, 92, 88],
                "pressure": [1002, 998, 995, 992, 990, 992, 995, 998]
            }
        }
        
    def detect(self, time_series: Dict[str, List[float]]) -> Dict:
        """
        Detect anomalies using reconstruction error
        
        Args:
            time_series: Dict with feature time-series
            
        Returns:
            Anomaly detection with reconstruction analysis
        """
        if not time_series:
            return {
                "model": self.model_name,
                "error": "No time-series data provided",
                "is_anomalous": False
            }
        
        # Normalize input
        normalized = {}
        for feature, values in time_series.items():
            if values and len(values) > 0:
                max_val = max(abs(v) for v in values) or 1
                normalized[feature] = [v / max_val for v in values[-8:]]  # Use last 8 points
        
        # Find best matching pattern
        best_pattern = None
        best_similarity = 0
        
        for pattern_name, pattern_data in self.normal_patterns.items():
            similarity = self._calculate_similarity(normalized, pattern_data)
            if similarity > best_similarity:
                best_similarity = similarity
                best_pattern = pattern_name
        
        # Calculate reconstruction error
        reconstruction_error = 1 - best_similarity
        is_anomalous = reconstruction_error > self.threshold
        
        # Identify which features contribute most to anomaly
        feature_errors = {}
        for feature in normalized:
            if feature in self.normal_patterns.get(best_pattern, {}):
                feat_error = self._feature_reconstruction_error(
                    normalized[feature],
                    self.normal_patterns[best_pattern][feature]
                )
                feature_errors[feature] = round(feat_error, 3)
        
        # Determine pattern transition (early warning)
        if best_pattern == "pre_flood" and best_similarity > 0.6:
            early_warning = {
                "triggered": True,
                "pattern_match": "pre_flood",
                "confidence": round(best_similarity, 2),
                "message": "Current conditions matching pre-flood pattern"
            }
        else:
            early_warning = {
                "triggered": False,
                "pattern_match": best_pattern,
                "confidence": round(best_similarity, 2)
            }
        
        return {
            "model": self.model_name,
            "reconstruction_error": round(reconstruction_error, 3),
            "is_anomalous": is_anomalous,
            "threshold": self.threshold,
            "best_matching_pattern": best_pattern,
            "pattern_similarity": round(best_similarity, 3),
            "feature_reconstruction_errors": feature_errors,
            "early_warning": early_warning,
            "timestamp": datetime.now().isoformat()
        }
    
    def _calculate_similarity(self, input_data: Dict, pattern: Dict) -> float:
        """Calculate cosine similarity between input and pattern"""
        similarities = []
        
        for feature in input_data:
            if feature in pattern:
                input_vec = input_data[feature]
                pattern_vec = pattern[feature][:len(input_vec)]
                
                if len(input_vec) != len(pattern_vec):
                    continue
                
                # Cosine similarity
                dot_product = sum(a * b for a, b in zip(input_vec, pattern_vec))
                norm_a = math.sqrt(sum(a ** 2 for a in input_vec)) or 1
                norm_b = math.sqrt(sum(b ** 2 for b in pattern_vec)) or 1
                
                similarity = dot_product / (norm_a * norm_b)
                similarities.append(max(0, similarity))
        
        return sum(similarities) / len(similarities) if similarities else 0.5
    
    def _feature_reconstruction_error(self, input_vec: List, pattern_vec: List) -> float:
        """Calculate MSE between input and pattern"""
        if len(input_vec) != len(pattern_vec):
            min_len = min(len(input_vec), len(pattern_vec))
            input_vec = input_vec[:min_len]
            pattern_vec = pattern_vec[:min_len]
        
        if not input_vec:
            return 0.5
        
        mse = sum((a - b) ** 2 for a, b in zip(input_vec, pattern_vec)) / len(input_vec)
        return min(1.0, mse)


class AnomalyDetector:
    """
    Main Anomaly Detection system combining multiple methods
    """
    
    def __init__(self):
        self.isolation_forest = IsolationForestSimulator()
        self.autoencoder = AutoencoderSimulator()
        
        # Rolling window for trend analysis
        self.history_window = deque(maxlen=100)
        
    def detect(self, 
               current_data: Dict,
               time_series: Optional[Dict[str, List[float]]] = None) -> Dict:
        """
        Comprehensive anomaly detection
        
        Args:
            current_data: Current sensor/weather readings
            time_series: Historical time-series data
            
        Returns:
            Combined anomaly detection results
        """
        # Run Isolation Forest on current data
        if_result = self.isolation_forest.detect(current_data)
        
        # Run Autoencoder on time-series (if available)
        ae_result = None
        if time_series:
            ae_result = self.autoencoder.detect(time_series)
        
        # Combine results
        combined_score = if_result["overall_anomaly_score"]
        if ae_result:
            combined_score = (
                if_result["overall_anomaly_score"] * 0.5 +
                ae_result["reconstruction_error"] * 0.5
            )
        
        # Determine alert level
        if combined_score >= 0.7:
            alert_level = "critical"
            alert_message = "🚨 CRITICAL: Multiple anomaly indicators triggered"
        elif combined_score >= 0.5:
            alert_level = "warning"
            alert_message = "⚠️ WARNING: Unusual patterns detected in environmental data"
        elif combined_score >= 0.3:
            alert_level = "watch"
            alert_message = "👁️ WATCH: Minor anomalies detected, monitoring closely"
        else:
            alert_level = "normal"
            alert_message = "✅ All readings within normal parameters"
        
        # Early warning triggers
        early_warnings = []
        
        # Check for rapid changes
        if time_series and "rainfall_hourly" in time_series:
            rainfall = time_series["rainfall_hourly"]
            if len(rainfall) >= 6:
                recent_avg = sum(rainfall[-3:]) / 3
                older_avg = sum(rainfall[-6:-3]) / 3 if len(rainfall) >= 6 else recent_avg
                if recent_avg > older_avg * 2 and recent_avg > 10:
                    early_warnings.append({
                        "type": "rainfall_surge",
                        "severity": "high",
                        "message": f"Rainfall intensity doubled in last 3 hours ({older_avg:.1f}→{recent_avg:.1f} mm/h)"
                    })
        
        # Check autoencoder early warning
        if ae_result and ae_result.get("early_warning", {}).get("triggered"):
            early_warnings.append({
                "type": "pattern_match",
                "severity": "high",
                "message": ae_result["early_warning"]["message"]
            })
        
        # Store in history
        self.history_window.append({
            "timestamp": datetime.now().isoformat(),
            "score": combined_score
        })
        
        # Calculate trend
        trend = self._calculate_trend()
        
        return {
            "timestamp": datetime.now().isoformat(),
            "combined_anomaly_score": round(combined_score, 3),
            "alert_level": alert_level,
            "alert_message": alert_message,
            "is_anomalous": combined_score > 0.5,
            "isolation_forest": if_result,
            "autoencoder": ae_result,
            "early_warnings": early_warnings,
            "trend": trend,
            "recommended_action": self._get_action(alert_level)
        }
    
    def _calculate_trend(self) -> Dict:
        """Calculate anomaly score trend"""
        if len(self.history_window) < 5:
            return {"direction": "stable", "change": 0}
        
        recent = list(self.history_window)[-5:]
        scores = [h["score"] for h in recent]
        
        # Simple trend calculation
        first_half = sum(scores[:2]) / 2
        second_half = sum(scores[-2:]) / 2
        change = second_half - first_half
        
        if change > 0.1:
            direction = "increasing"
        elif change < -0.1:
            direction = "decreasing"
        else:
            direction = "stable"
        
        return {
            "direction": direction,
            "change": round(change, 3),
            "samples": len(self.history_window)
        }
    
    def _get_action(self, alert_level: str) -> str:
        """Get recommended action based on alert level"""
        actions = {
            "critical": "Initiate emergency response protocols immediately",
            "warning": "Increase monitoring frequency, prepare contingency plans",
            "watch": "Continue monitoring, no immediate action required",
            "normal": "Maintain standard monitoring schedule"
        }
        return actions.get(alert_level, actions["normal"])
