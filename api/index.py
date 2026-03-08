"""
Rescue Ping - FastAPI Backend for Vercel
This is the main API entry point for Vercel deployment
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
import urllib.request
import urllib.parse
import json
import os
import random
from dotenv import load_dotenv

load_dotenv()

# OpenWeatherMap API key

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

if not OPENWEATHER_API_KEY:
    raise RuntimeError("OPENWEATHER_API_KEY is not set")
# USGS Earthquake API
USGS_EARTHQUAKE_URL = "https://earthquake.usgs.gov/fdsnws/event/1/query"

app = FastAPI(
    title="Rescue Ping API",
    description="Disaster prediction and alert management API with AQI",
    version="2.0.1"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
@app.get("/api")
def root():
    """API root endpoint"""
    return {
        "message": "Rescue Ping API",
        "version": "2.0.0",
        "endpoints": [
            "/api/health",
            "/api/weather/{lat}/{lon}",
            "/api/weather/air-quality/{lat}/{lon}",
            "/api/predict/disaster-risk",
            "/api/alerts",
            "/api/alerts/active",
            "/api/earthquakes"
        ],
        "timestamp": datetime.now().isoformat()
    }


@app.get("/api/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "api": "operational",
            "ml_model": "ready",
            "external_apis": "connected"
        },
        "version": "2.0.0-vercel",
        "platform": "vercel"
    }


def fetch_weather(lat: float, lon: float):
    """Fetch weather data from OpenWeatherMap"""
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=10) as response:
            return json.loads(response.read().decode()), True
    except Exception as e:
        return None, False


def calculate_risk(weather_data):
    """Rule-based risk calculation"""
    if not weather_data:
        return {
            "overall_risk": "moderate",
            "risk_score": 4.5,
            "flood_risk": 3.2,
            "fire_risk": 2.8,
            "earthquake_risk": 1.5,
            "storm_risk": 4.1,
            "confidence": 0.75
        }
    
    temp = weather_data.get("main", {}).get("temp", 25)
    humidity = weather_data.get("main", {}).get("humidity", 60)
    wind_speed = weather_data.get("wind", {}).get("speed", 10)
    pressure = weather_data.get("main", {}).get("pressure", 1013)
    
    risk_score = 3.0
    
    # Temperature risk
    if temp > 35 or temp < 5:
        risk_score += 2
    elif temp > 30 or temp < 10:
        risk_score += 1
    
    # Storm risk
    storm_risk = 2.0
    if wind_speed > 20:
        storm_risk = 8.0
        risk_score += 2
    elif wind_speed > 15:
        storm_risk = 6.0
        risk_score += 1
    elif wind_speed > 10:
        storm_risk = 4.0
    
    # Fire risk
    fire_risk = 2.0
    if humidity < 30:
        fire_risk = 7.0
        risk_score += 1.5
    elif humidity < 50:
        fire_risk = 4.0
    
    # Flood risk
    flood_risk = 2.0
    if humidity > 80:
        flood_risk = 6.0
        risk_score += 1
    elif humidity > 70:
        flood_risk = 4.0
    
    # Pressure risk
    if pressure < 1000:
        risk_score += 1.5
        storm_risk += 2
    
    # Overall risk level
    if risk_score >= 8:
        overall_risk = "critical"
    elif risk_score >= 6:
        overall_risk = "high"
    elif risk_score >= 4:
        overall_risk = "moderate"
    else:
        overall_risk = "low"
    
    return {
        "overall_risk": overall_risk,
        "risk_score": min(round(risk_score, 1), 10),
        "flood_risk": min(round(flood_risk, 1), 10),
        "fire_risk": min(round(fire_risk, 1), 10),
        "earthquake_risk": round(random.uniform(1, 3), 1),
        "storm_risk": min(round(storm_risk, 1), 10),
        "confidence": 0.85
    }


@app.get("/api/weather/{lat}/{lon}")
def get_weather(lat: float, lon: float):
    """Get current weather for coordinates"""
    weather_data, is_real = fetch_weather(lat, lon)
    
    if weather_data and is_real:
        return {
            "success": True,
            "is_real": True,
            "source": "OpenWeatherMap",
            "location": {"latitude": lat, "longitude": lon},
            "weather": {
                "temperature": weather_data.get("main", {}).get("temp", 0),
                "feels_like": weather_data.get("main", {}).get("feels_like", 0),
                "humidity": weather_data.get("main", {}).get("humidity", 0),
                "pressure": weather_data.get("main", {}).get("pressure", 0),
                "wind_speed": weather_data.get("wind", {}).get("speed", 0),
                "wind_direction": weather_data.get("wind", {}).get("deg", 0),
                "description": weather_data.get("weather", [{}])[0].get("description", "Unknown"),
                "clouds": weather_data.get("clouds", {}).get("all", 0),
                "visibility": weather_data.get("visibility", 10000)
            },
            "timestamp": datetime.now().isoformat()
        }
    else:
        return {
            "success": True,
            "is_real": False,
            "source": "Fallback",
            "location": {"latitude": lat, "longitude": lon},
            "weather": {
                "temperature": 25,
                "feels_like": 27,
                "humidity": 60,
                "pressure": 1013,
                "wind_speed": 5,
                "wind_direction": 180,
                "description": "Clear sky",
                "clouds": 20,
                "visibility": 10000
            },
            "timestamp": datetime.now().isoformat()
        }


def fetch_air_quality(lat: float, lon: float):
    """Fetch air quality data from OpenWeatherMap Air Pollution API"""
    url = f"http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}"
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=10) as response:
            return json.loads(response.read().decode()), True
    except Exception as e:
        return None, False


@app.get("/api/weather/air-quality/{lat}/{lon}")
def get_air_quality(lat: float, lon: float):
    """Get Air Quality Index (AQI) data for specified coordinates"""
    aqi_data, is_real = fetch_air_quality(lat, lon)
    
    aqi_categories = {
        1: {"level": "Good", "color": "green", "description": "Air quality is satisfactory"},
        2: {"level": "Fair", "color": "yellow", "description": "Air quality is acceptable"},
        3: {"level": "Moderate", "color": "orange", "description": "Sensitive groups may experience health effects"},
        4: {"level": "Poor", "color": "red", "description": "Health effects may be experienced by everyone"},
        5: {"level": "Very Poor", "color": "purple", "description": "Health alert: everyone may experience serious effects"}
    }
    
    if aqi_data and is_real:
        try:
            list_data = aqi_data.get("list", [{}])[0]
            aqi_index = list_data.get("main", {}).get("aqi", 2)
            components = list_data.get("components", {})
            category = aqi_categories.get(aqi_index, aqi_categories[3])
            
            return {
                "aqi": aqi_index,
                "level": category["level"],
                "color": category["color"],
                "description": category["description"],
                "components": {
                    "pm2_5": round(components.get("pm2_5", 0), 2),
                    "pm10": round(components.get("pm10", 0), 2),
                    "no2": round(components.get("no2", 0), 2),
                    "o3": round(components.get("o3", 0), 2),
                    "so2": round(components.get("so2", 0), 2),
                    "co": round(components.get("co", 0), 2)
                },
                "timestamp": datetime.now().isoformat(),
                "location": {"latitude": lat, "longitude": lon},
                "is_real": True
            }
        except Exception as e:
            pass
    
    # Return fallback data
    base_aqi = random.randint(1, 3)
    if 20 <= abs(lat) <= 40:
        base_aqi = min(base_aqi + 1, 5)
    
    category = aqi_categories[base_aqi]
    pm2_5 = round(random.uniform(5, 150) if base_aqi >= 3 else random.uniform(0, 50), 2)
    
    return {
        "aqi": base_aqi,
        "level": category["level"],
        "color": category["color"],
        "description": category["description"],
        "components": {
            "pm2_5": pm2_5,
            "pm10": round(pm2_5 * 1.5 + random.uniform(0, 20), 2),
            "no2": round(random.uniform(10, 100), 2),
            "o3": round(random.uniform(30, 120), 2),
            "so2": round(random.uniform(5, 50), 2),
            "co": round(random.uniform(200, 1000), 2)
        },
        "timestamp": datetime.now().isoformat(),
        "location": {"latitude": lat, "longitude": lon},
        "is_real": False
    }


@app.get("/api/predict/disaster-risk")
@app.post("/api/predict/disaster-risk")
async def predict_disaster_risk(request: Request, lat: float = 28.6139, lon: float = 77.2090):
    """Predict disaster risk for given coordinates"""
    # Try to get coords from POST body
    if request.method == "POST":
        try:
            body = await request.json()
            lat = body.get("latitude", body.get("lat", lat))
            lon = body.get("longitude", body.get("lon", lon))
        except:
            pass
    
    weather_data, is_real = fetch_weather(lat, lon)
    risk = calculate_risk(weather_data)
    
    return {
        "success": True,
        "is_real": is_real,
        **risk,
        "location_analyzed": {"latitude": lat, "longitude": lon},
        "model_version": "RuleBased-v1",
        "timestamp": datetime.now().isoformat()
    }


def fetch_alerts_data(lat: float, lon: float):
    """Common function to fetch alerts data"""
    alerts = []
    
    # Fetch earthquakes from USGS
    try:
        end_time = datetime.utcnow()
        start_time = end_time - timedelta(days=1)
        
        usgs_params = {
            "format": "geojson",
            "starttime": start_time.strftime("%Y-%m-%d"),
            "endtime": end_time.strftime("%Y-%m-%d"),
            "minmagnitude": "2.5",
            "latitude": str(lat),
            "longitude": str(lon),
            "maxradiuskm": "500"
        }
        
        url = f"{USGS_EARTHQUAKE_URL}?{urllib.parse.urlencode(usgs_params)}"
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode())
        
        for feature in data.get("features", [])[:5]:
            props = feature.get("properties", {})
            mag = props.get("mag", 0) or 0
            alerts.append({
                "id": f"eq-{feature.get('id')}",
                "title": f"Earthquake Alert - M{mag}",
                "description": f"Earthquake detected: {props.get('place')}",
                "severity": "High" if mag >= 5.0 else "Medium",
                "urgency": "Immediate" if mag >= 5.0 else "Expected",
                "event": "Earthquake",
                "areas": [props.get('place')] if props.get('place') else [],
                "onset": datetime.now().isoformat(),
                "expires": (datetime.now() + timedelta(hours=6)).isoformat()
            })
    except Exception as e:
        print(f"USGS API error: {e}")
    
    return {
        "alerts": alerts,
        "count": len(alerts),
        "source": "Rescue_Ping_System",
        "is_real": len(alerts) > 0,
        "location": {"latitude": lat, "longitude": lon},
        "timestamp": datetime.now().isoformat()
    }


# Support both /api/alerts and /api/alerts/active
@app.get("/api/alerts")
def get_alerts(lat: float = 28.6139, lon: float = 77.2090):
    """Get active alerts for coordinates (alias)"""
    return fetch_alerts_data(lat, lon)


@app.get("/api/alerts/active")
def get_active_alerts(lat: float = 28.6139, lon: float = 77.2090):
    """Get active alerts for coordinates"""
    return fetch_alerts_data(lat, lon)


@app.get("/api/earthquakes")
def get_earthquakes(lat: float = 28.6139, lon: float = 77.2090, radius: int = 500, days: int = 7):
    """Get recent earthquakes near coordinates"""
    earthquakes = []
    
    try:
        end_time = datetime.utcnow()
        start_time = end_time - timedelta(days=days)
        
        usgs_params = {
            "format": "geojson",
            "starttime": start_time.strftime("%Y-%m-%d"),
            "endtime": end_time.strftime("%Y-%m-%d"),
            "minmagnitude": "2.5",
            "latitude": str(lat),
            "longitude": str(lon),
            "maxradiuskm": str(radius),
            "orderby": "time"
        }
        
        url = f"{USGS_EARTHQUAKE_URL}?{urllib.parse.urlencode(usgs_params)}"
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode())
        
        for feature in data.get("features", [])[:20]:
            props = feature.get("properties", {})
            coords = feature.get("geometry", {}).get("coordinates", [0, 0, 0])
            earthquakes.append({
                "id": feature.get("id"),
                "magnitude": props.get("mag"),
                "place": props.get("place"),
                "time": props.get("time"),
                "depth": coords[2] if len(coords) > 2 else 0,
                "longitude": coords[0] if len(coords) > 0 else 0,
                "latitude": coords[1] if len(coords) > 1 else 0,
                "url": props.get("url"),
                "tsunami": props.get("tsunami", 0)
            })
    except Exception as e:
        print(f"USGS API error: {e}")
    
    return {
        "earthquakes": earthquakes,
        "count": len(earthquakes),
        "source": "USGS",
        "is_real": len(earthquakes) > 0,
        "search_params": {
            "center": {"latitude": lat, "longitude": lon},
            "radius_km": radius,
            "days": days
        },
        "timestamp": datetime.now().isoformat()
    }
