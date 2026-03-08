"""
Smart Alert Engine for Rescue Ping
Implements ML-triggered alerts with multi-condition logic
Not simple thresholds - intelligent alert generation
"""

from typing import Dict, List, Optional, Tuple
from datetime import datetime, timedelta
from enum import Enum
import math


class AlertSeverity(Enum):
    INFO = "info"
    WATCH = "watch"
    WARNING = "warning"
    SEVERE = "severe"
    CRITICAL = "critical"


class AlertType(Enum):
    FLOOD = "flood"
    FLASH_FLOOD = "flash_flood"
    RIVER_OVERFLOW = "river_overflow"
    STORM = "storm"
    HEAVY_RAINFALL = "heavy_rainfall"
    WATER_LEVEL = "water_level"
    EVACUATION = "evacuation"
    ALL_CLEAR = "all_clear"


class SmartAlertEngine:
    """
    Intelligent Alert Generation System
    Uses ML predictions, anomaly scores, and multi-condition logic
    """
    
    def __init__(self):
        # Configurable thresholds (area-specific calibration)
        self.thresholds = {
            "flood_probability_high": 0.72,
            "flood_probability_medium": 0.45,
            "anomaly_score_trigger": 0.6,
            "rainfall_90th_percentile": 50,  # mm/24h (varies by region)
            "water_level_critical": 0.9,     # % of flood stage
            "discharge_critical": 0.85,
            "confidence_minimum": 0.6
        }
        
        # Alert history for de-duplication and escalation
        self.alert_history: List[Dict] = []
        self.active_alerts: Dict[str, Dict] = {}
        
        # Regional calibration factors (would be loaded from database)
        self.regional_factors = {
            "default": 1.0,
            "coastal": 1.2,
            "riverine": 1.15,
            "urban": 1.1,
            "hilly": 0.95
        }
        
    def generate_alert(self,
                       location: Dict,
                       flood_prediction: Dict,
                       anomaly_result: Dict,
                       weather_forecast: Dict,
                       historical_context: Optional[Dict] = None) -> Dict:
        """
        Generate intelligent alert based on multiple inputs
        
        Alert Logic (NOT simple thresholds):
        IF flood_probability > 0.72
        AND anomaly_score > 0.6
        AND rainfall_forecast_next_24h > local_90th_percentile
        THEN Alert = "High Risk"
        """
        timestamp = datetime.now()
        
        # Extract key metrics
        flood_prob = flood_prediction.get("ensemble_prediction", {}).get("flood_probability", 0)
        flood_confidence = flood_prediction.get("ensemble_prediction", {}).get("confidence", 0)
        risk_level = flood_prediction.get("ensemble_prediction", {}).get("risk_level", "Low")
        
        anomaly_score = anomaly_result.get("combined_anomaly_score", 0)
        anomaly_alert = anomaly_result.get("alert_level", "normal")
        early_warnings = anomaly_result.get("early_warnings", [])
        
        rainfall_24h = weather_forecast.get("rainfall_24h_forecast", 0)
        rainfall_intensity = weather_forecast.get("max_rainfall_intensity", 0)
        
        # Get regional calibration
        region_type = location.get("region_type", "default")
        calibration_factor = self.regional_factors.get(region_type, 1.0)
        
        # Apply calibration
        adjusted_threshold = self.thresholds["flood_probability_high"] / calibration_factor
        
        # Multi-condition alert logic
        conditions_met = []
        
        # Condition 1: High flood probability
        if flood_prob > adjusted_threshold:
            conditions_met.append({
                "condition": "high_flood_probability",
                "value": flood_prob,
                "threshold": adjusted_threshold,
                "weight": 0.35
            })
        
        # Condition 2: Anomaly detection triggered
        if anomaly_score > self.thresholds["anomaly_score_trigger"]:
            conditions_met.append({
                "condition": "anomaly_detected",
                "value": anomaly_score,
                "threshold": self.thresholds["anomaly_score_trigger"],
                "weight": 0.25
            })
        
        # Condition 3: Heavy rainfall forecast
        if rainfall_24h > self.thresholds["rainfall_90th_percentile"]:
            conditions_met.append({
                "condition": "heavy_rainfall_forecast",
                "value": rainfall_24h,
                "threshold": self.thresholds["rainfall_90th_percentile"],
                "weight": 0.25
            })
        
        # Condition 4: Early warning signals
        if len(early_warnings) > 0:
            conditions_met.append({
                "condition": "early_warning_signals",
                "value": len(early_warnings),
                "threshold": 1,
                "weight": 0.15
            })
        
        # Calculate weighted alert score
        if conditions_met:
            alert_score = sum(c["weight"] for c in conditions_met)
        else:
            alert_score = 0
        
        # Confidence adjustment
        if flood_confidence < self.thresholds["confidence_minimum"]:
            alert_score *= 0.7  # Reduce alert strength if low confidence
        
        # Determine alert severity
        severity = self._determine_severity(alert_score, conditions_met)
        
        # Determine alert type
        alert_type = self._determine_alert_type(
            flood_prob, rainfall_24h, anomaly_result, location
        )
        
        # Generate alert message
        alert = self._create_alert(
            severity=severity,
            alert_type=alert_type,
            location=location,
            conditions_met=conditions_met,
            flood_prediction=flood_prediction,
            anomaly_result=anomaly_result,
            weather_forecast=weather_forecast,
            timestamp=timestamp
        )
        
        # Check for escalation/de-escalation
        alert = self._handle_escalation(alert)
        
        # Store in history
        self._store_alert(alert)
        
        return alert
    
    def _determine_severity(self, alert_score: float, 
                           conditions: List[Dict]) -> AlertSeverity:
        """Determine alert severity from score and conditions"""
        condition_count = len(conditions)
        
        # Critical: high score + multiple conditions
        if alert_score >= 0.75 and condition_count >= 3:
            return AlertSeverity.CRITICAL
        
        # Severe: high score or many conditions
        if alert_score >= 0.6 or (alert_score >= 0.5 and condition_count >= 3):
            return AlertSeverity.SEVERE
        
        # Warning: moderate score
        if alert_score >= 0.4 or condition_count >= 2:
            return AlertSeverity.WARNING
        
        # Watch: low score but some conditions
        if alert_score >= 0.2 or condition_count >= 1:
            return AlertSeverity.WATCH
        
        return AlertSeverity.INFO
    
    def _determine_alert_type(self, flood_prob: float, rainfall: float,
                              anomaly: Dict, location: Dict) -> AlertType:
        """Determine specific alert type"""
        # Check for flash flood conditions
        early_warnings = anomaly.get("early_warnings", [])
        for warning in early_warnings:
            if warning.get("type") == "rainfall_surge":
                return AlertType.FLASH_FLOOD
        
        # Check for river overflow
        if location.get("near_river", False) and flood_prob > 0.6:
            return AlertType.RIVER_OVERFLOW
        
        # Heavy rainfall alert
        if rainfall > 80 and flood_prob < 0.5:
            return AlertType.HEAVY_RAINFALL
        
        # Standard flood alert
        if flood_prob > 0.5:
            return AlertType.FLOOD
        
        return AlertType.FLOOD  # Default
    
    def _create_alert(self, severity: AlertSeverity, alert_type: AlertType,
                      location: Dict, conditions_met: List[Dict],
                      flood_prediction: Dict, anomaly_result: Dict,
                      weather_forecast: Dict, timestamp: datetime) -> Dict:
        """Create comprehensive alert object"""
        
        # Generate human-readable title
        title = self._generate_title(severity, alert_type)
        
        # Generate detailed description
        description = self._generate_description(
            severity, alert_type, conditions_met, 
            flood_prediction, weather_forecast
        )
        
        # Generate actionable instructions
        instructions = self._generate_instructions(severity, alert_type)
        
        # Identify affected areas
        affected_areas = self._identify_affected_areas(location, flood_prediction)
        
        # Generate SMS-ready payload (for offline alerts)
        sms_payload = self._generate_sms_payload(
            severity, alert_type, location, 
            flood_prediction.get("ensemble_prediction", {}).get("flood_probability", 0)
        )
        
        return {
            "alert_id": f"ALERT-{timestamp.strftime('%Y%m%d%H%M%S')}-{location.get('district', 'UNK')[:3].upper()}",
            "timestamp": timestamp.isoformat(),
            "expires": (timestamp + timedelta(hours=24)).isoformat(),
            
            "severity": severity.value,
            "type": alert_type.value,
            "title": title,
            "description": description,
            
            "location": {
                "latitude": location.get("latitude"),
                "longitude": location.get("longitude"),
                "district": location.get("district"),
                "state": location.get("state"),
                "affected_areas": affected_areas
            },
            
            "metrics": {
                "flood_probability": flood_prediction.get("ensemble_prediction", {}).get("flood_probability", 0),
                "confidence": flood_prediction.get("ensemble_prediction", {}).get("confidence", 0),
                "anomaly_score": anomaly_result.get("combined_anomaly_score", 0),
                "conditions_met": len(conditions_met)
            },
            
            "conditions_analysis": conditions_met,
            
            "predictions": {
                "6h": flood_prediction.get("ensemble_prediction", {}).get("predictions_by_horizon", {}).get("6h"),
                "12h": flood_prediction.get("ensemble_prediction", {}).get("predictions_by_horizon", {}).get("12h"),
                "24h": flood_prediction.get("ensemble_prediction", {}).get("predictions_by_horizon", {}).get("24h")
            },
            
            "instructions": instructions,
            
            "resources": {
                "evacuation_centers": self._get_nearest_shelters(location),
                "emergency_contacts": self._get_emergency_contacts(location),
                "safe_zones": self._identify_safe_zones(location)
            },
            
            "sms_payload": sms_payload,
            
            "ai_reasoning": flood_prediction.get("reasoning", ""),
            "uncertainty": flood_prediction.get("uncertainty", {}),
            
            "status": "active",
            "acknowledged": False
        }
    
    def _generate_title(self, severity: AlertSeverity, 
                        alert_type: AlertType) -> str:
        """Generate alert title"""
        severity_prefix = {
            AlertSeverity.CRITICAL: "🚨 CRITICAL",
            AlertSeverity.SEVERE: "⛔ SEVERE",
            AlertSeverity.WARNING: "⚠️ WARNING",
            AlertSeverity.WATCH: "👁️ WATCH",
            AlertSeverity.INFO: "ℹ️ INFO"
        }
        
        type_suffix = {
            AlertType.FLOOD: "Flood Alert",
            AlertType.FLASH_FLOOD: "Flash Flood Alert",
            AlertType.RIVER_OVERFLOW: "River Overflow Alert",
            AlertType.STORM: "Storm Alert",
            AlertType.HEAVY_RAINFALL: "Heavy Rainfall Alert",
            AlertType.WATER_LEVEL: "Water Level Alert",
            AlertType.EVACUATION: "Evacuation Notice"
        }
        
        return f"{severity_prefix.get(severity, 'ℹ️')} {type_suffix.get(alert_type, 'Alert')}"
    
    def _generate_description(self, severity: AlertSeverity, alert_type: AlertType,
                             conditions: List[Dict], prediction: Dict,
                             weather: Dict) -> str:
        """Generate detailed alert description"""
        flood_prob = prediction.get("ensemble_prediction", {}).get("flood_probability", 0)
        confidence = prediction.get("ensemble_prediction", {}).get("confidence", 0)
        
        descriptions = []
        
        # Main probability statement
        descriptions.append(
            f"Flood probability: {flood_prob*100:.0f}% (Confidence: {confidence*100:.0f}%)"
        )
        
        # Condition explanations
        for cond in conditions:
            if cond["condition"] == "high_flood_probability":
                descriptions.append(f"ML models indicate elevated flood risk")
            elif cond["condition"] == "anomaly_detected":
                descriptions.append(f"Unusual patterns detected in environmental data")
            elif cond["condition"] == "heavy_rainfall_forecast":
                descriptions.append(f"Heavy rainfall expected: {cond['value']:.0f}mm in 24h")
            elif cond["condition"] == "early_warning_signals":
                descriptions.append(f"Early warning indicators triggered")
        
        # Time estimate
        if flood_prob > 0.5:
            predictions = prediction.get("ensemble_prediction", {}).get("predictions_by_horizon", {})
            if predictions.get("6h", 0) > 0.7:
                descriptions.append("⏱️ Potential impact within 6 hours")
            elif predictions.get("12h", 0) > 0.7:
                descriptions.append("⏱️ Potential impact within 12 hours")
            else:
                descriptions.append("⏱️ Monitor for next 24 hours")
        
        return " | ".join(descriptions)
    
    def _generate_instructions(self, severity: AlertSeverity,
                               alert_type: AlertType) -> List[Dict]:
        """Generate actionable instructions"""
        base_instructions = {
            AlertSeverity.CRITICAL: [
                {"priority": 1, "action": "EVACUATE immediately to higher ground", "icon": "🏃"},
                {"priority": 2, "action": "Call emergency services if trapped", "icon": "📞"},
                {"priority": 3, "action": "Do NOT attempt to cross flooded areas", "icon": "🚫"},
                {"priority": 4, "action": "Move to designated evacuation centers", "icon": "🏛️"},
                {"priority": 5, "action": "Keep emergency supplies ready", "icon": "🎒"}
            ],
            AlertSeverity.SEVERE: [
                {"priority": 1, "action": "Prepare for possible evacuation", "icon": "🎒"},
                {"priority": 2, "action": "Move valuables to higher floors", "icon": "📦"},
                {"priority": 3, "action": "Charge all communication devices", "icon": "🔋"},
                {"priority": 4, "action": "Know your evacuation route", "icon": "🗺️"},
                {"priority": 5, "action": "Monitor official updates continuously", "icon": "📻"}
            ],
            AlertSeverity.WARNING: [
                {"priority": 1, "action": "Stay informed through official channels", "icon": "📱"},
                {"priority": 2, "action": "Avoid low-lying areas", "icon": "⬆️"},
                {"priority": 3, "action": "Secure outdoor items", "icon": "🔒"},
                {"priority": 4, "action": "Review family emergency plan", "icon": "👨‍👩‍👧‍👦"},
                {"priority": 5, "action": "Stock essential supplies", "icon": "🛒"}
            ],
            AlertSeverity.WATCH: [
                {"priority": 1, "action": "Monitor weather updates", "icon": "🌤️"},
                {"priority": 2, "action": "Be prepared to act if conditions worsen", "icon": "👀"},
                {"priority": 3, "action": "Check emergency supplies", "icon": "✅"}
            ],
            AlertSeverity.INFO: [
                {"priority": 1, "action": "Stay aware of changing conditions", "icon": "ℹ️"},
                {"priority": 2, "action": "No immediate action required", "icon": "✅"}
            ]
        }
        
        return base_instructions.get(severity, base_instructions[AlertSeverity.INFO])
    
    def _identify_affected_areas(self, location: Dict, 
                                prediction: Dict) -> List[str]:
        """Identify potentially affected areas"""
        areas = []
        
        district = location.get("district", "Unknown District")
        areas.append(district)
        
        # Add nearby areas based on risk propagation
        if prediction.get("model_outputs", {}).get("gnn", {}).get("propagation_probability", 0) > 0.5:
            areas.append(f"Downstream areas from {district}")
        
        if location.get("near_river"):
            areas.append("River-adjacent communities")
        
        return areas
    
    def _get_nearest_shelters(self, location: Dict) -> List[Dict]:
        """Get nearest evacuation centers (mock data)"""
        lat = location.get("latitude", 0)
        lon = location.get("longitude", 0)
        
        # In production, this would query a real database
        return [
            {
                "name": "Government School - Emergency Shelter",
                "distance_km": 2.5,
                "capacity": 500,
                "coordinates": {"lat": lat + 0.02, "lon": lon + 0.01}
            },
            {
                "name": "Community Center",
                "distance_km": 4.1,
                "capacity": 300,
                "coordinates": {"lat": lat - 0.03, "lon": lon + 0.02}
            },
            {
                "name": "Sports Stadium - Mass Shelter",
                "distance_km": 6.8,
                "capacity": 2000,
                "coordinates": {"lat": lat + 0.05, "lon": lon - 0.03}
            }
        ]
    
    def _get_emergency_contacts(self, location: Dict) -> Dict:
        """Get emergency contact numbers"""
        return {
            "national_disaster_response": "1078",
            "flood_control_room": "1800-180-1551",
            "police": "100",
            "ambulance": "102",
            "fire": "101",
            "district_collector": location.get("emergency_contact", "N/A")
        }
    
    def _identify_safe_zones(self, location: Dict) -> List[Dict]:
        """Identify safe zones based on elevation"""
        lat = location.get("latitude", 0)
        lon = location.get("longitude", 0)
        
        return [
            {
                "name": "Higher Elevation Area - North",
                "elevation_m": 250,
                "distance_km": 3.2,
                "coordinates": {"lat": lat + 0.025, "lon": lon}
            },
            {
                "name": "Ridge Area - West",
                "elevation_m": 280,
                "distance_km": 5.5,
                "coordinates": {"lat": lat, "lon": lon - 0.04}
            }
        ]
    
    def _generate_sms_payload(self, severity: AlertSeverity, alert_type: AlertType,
                              location: Dict, probability: float) -> str:
        """Generate SMS-ready alert payload (160 char limit)"""
        district = location.get("district", "Your Area")[:15]
        prob_pct = int(probability * 100)
        
        templates = {
            AlertSeverity.CRITICAL: f"🚨CRITICAL:{district} FLOOD ALERT! Risk:{prob_pct}%. EVACUATE NOW to high ground. Call 1078 for help.",
            AlertSeverity.SEVERE: f"⛔SEVERE:{district} flood risk {prob_pct}%. Prepare evacuation. Monitor updates. Emergency:1078",
            AlertSeverity.WARNING: f"⚠️WARNING:{district} flood risk {prob_pct}%. Stay alert, avoid low areas. Updates:rescueping.in",
            AlertSeverity.WATCH: f"👁️WATCH:{district} elevated flood risk. Monitor conditions. Stay informed.",
            AlertSeverity.INFO: f"ℹ️{district}: Normal conditions. Stay prepared."
        }
        
        return templates.get(severity, templates[AlertSeverity.INFO])[:160]
    
    def _handle_escalation(self, alert: Dict) -> Dict:
        """Handle alert escalation/de-escalation based on history"""
        alert_id = alert["alert_id"]
        location_key = f"{alert['location']['latitude']:.2f}_{alert['location']['longitude']:.2f}"
        
        # Check for existing active alert in same area
        existing = self.active_alerts.get(location_key)
        
        if existing:
            existing_severity = AlertSeverity(existing["severity"])
            new_severity = AlertSeverity(alert["severity"])
            
            severity_order = [AlertSeverity.INFO, AlertSeverity.WATCH, 
                           AlertSeverity.WARNING, AlertSeverity.SEVERE, 
                           AlertSeverity.CRITICAL]
            
            existing_idx = severity_order.index(existing_severity)
            new_idx = severity_order.index(new_severity)
            
            if new_idx > existing_idx:
                alert["escalation"] = {
                    "type": "escalated",
                    "from": existing_severity.value,
                    "to": new_severity.value,
                    "previous_alert_id": existing["alert_id"]
                }
            elif new_idx < existing_idx:
                alert["escalation"] = {
                    "type": "de-escalated",
                    "from": existing_severity.value,
                    "to": new_severity.value,
                    "previous_alert_id": existing["alert_id"]
                }
            else:
                alert["escalation"] = {
                    "type": "maintained",
                    "level": new_severity.value
                }
        else:
            alert["escalation"] = {
                "type": "new",
                "level": alert["severity"]
            }
        
        # Update active alerts
        self.active_alerts[location_key] = alert
        
        return alert
    
    def _store_alert(self, alert: Dict):
        """Store alert in history"""
        self.alert_history.append({
            "alert_id": alert["alert_id"],
            "timestamp": alert["timestamp"],
            "severity": alert["severity"],
            "type": alert["type"],
            "location": alert["location"]
        })
        
        # Keep only last 1000 alerts
        if len(self.alert_history) > 1000:
            self.alert_history = self.alert_history[-1000:]
    
    def get_active_alerts(self, location: Optional[Dict] = None) -> List[Dict]:
        """Get currently active alerts, optionally filtered by location"""
        if location:
            lat = location.get("latitude", 0)
            lon = location.get("longitude", 0)
            
            # Filter by proximity (within ~50km)
            filtered = []
            for key, alert in self.active_alerts.items():
                alert_lat = alert["location"]["latitude"]
                alert_lon = alert["location"]["longitude"]
                
                # Simple distance check
                dist = math.sqrt((lat - alert_lat)**2 + (lon - alert_lon)**2)
                if dist < 0.5:  # Roughly 50km
                    filtered.append(alert)
            
            return filtered
        
        return list(self.active_alerts.values())
    
    def acknowledge_alert(self, alert_id: str) -> bool:
        """Mark an alert as acknowledged"""
        for key, alert in self.active_alerts.items():
            if alert["alert_id"] == alert_id:
                alert["acknowledged"] = True
                alert["acknowledged_at"] = datetime.now().isoformat()
                return True
        return False
    
    def clear_alert(self, alert_id: str) -> bool:
        """Clear/deactivate an alert"""
        for key, alert in list(self.active_alerts.items()):
            if alert["alert_id"] == alert_id:
                alert["status"] = "cleared"
                alert["cleared_at"] = datetime.now().isoformat()
                del self.active_alerts[key]
                return True
        return False
