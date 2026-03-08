import streamlit as st
import joblib
import numpy as np
import pandas as pd
import os
from pathlib import Path
import logging
import sentry_sdk
from sentry_sdk.integrations.logging import LoggingIntegration

# Initialize Sentry for Streamlit
if os.getenv("SENTRY_DSN"):
    sentry_sdk.init(
        dsn=os.getenv("SENTRY_DSN"),
        release="rescue-ping-streamlit@1.0.0",
        environment="production",
        traces_sample_rate=1.0,
        profiles_sample_rate=1.0,
        integrations=[
            LoggingIntegration(level=logging.INFO, event_level=logging.INFO)
        ]
    )

# Set page config
st.set_page_config(
    page_title="Rescue Ping - Disaster Prediction Dashboard",
    page_icon="🚨",
    layout="wide"
)

# Title and Description
st.title("🚨 Rescue Ping - AI-Powered Disaster Prediction")
st.markdown("""
This dashboard allows you to manually input environmental parameters and get real-time disaster risk predictions 
using our trained Machine Learning models.
""")

# Load Models
@st.cache_resource
def load_models():
    models_dir = Path("models")
    try:
        models = {
            "flood": joblib.load(models_dir / "flood_model.joblib"),
            "fire": joblib.load(models_dir / "fire_model.joblib"),
            "earthquake": joblib.load(models_dir / "earthquake_model.joblib"),
            "storm": joblib.load(models_dir / "storm_model.joblib"),
            "scaler": joblib.load(models_dir / "scaler.joblib")
        }
        return models
    except Exception as e:
        st.error(f"Error loading models: {e}")
        return None

models = load_models()

if models:
    st.sidebar.header("Environmental Parameters")
    
    # Input Features
    st.sidebar.subheader("Location & Geography")
    latitude = st.sidebar.slider("Latitude", -90.0, 90.0, 34.0522)
    longitude = st.sidebar.slider("Longitude", -180.0, 180.0, -118.2437)
    elevation = st.sidebar.number_input("Elevation (m)", value=100.0)
    coastal_distance = st.sidebar.number_input("Distance to Coast (km)", value=50.0)
    population_density = st.sidebar.number_input("Population Density", value=1000.0)

    st.sidebar.subheader("Weather Conditions")
    temperature = st.sidebar.slider("Temperature (°C)", -50.0, 60.0, 25.0)
    humidity = st.sidebar.slider("Humidity (%)", 0.0, 100.0, 45.0)
    pressure = st.sidebar.slider("Pressure (hPa)", 900.0, 1100.0, 1013.0)
    wind_speed = st.sidebar.slider("Wind Speed (km/h)", 0.0, 200.0, 15.0)
    precipitation = st.sidebar.number_input("Precipitation (mm)", value=0.0)
    
    st.sidebar.subheader("Advanced Metrics")
    vegetation_index = st.sidebar.slider("Vegetation Index (NDVI)", 0.0, 1.0, 0.5)
    soil_moisture = st.sidebar.slider("Soil Moisture (0-1)", 0.0, 1.0, 0.3)
    temperature_change = st.sidebar.number_input("24h Temp Change (°C)", value=0.0)
    seasonal_factor = st.sidebar.slider("Seasonal Factor (-1 to 1)", -1.0, 1.0, 0.0)

    # Prepare input vector
    input_data = np.array([[
        latitude, longitude, elevation, coastal_distance, population_density,
        temperature, humidity, pressure, wind_speed,
        precipitation, vegetation_index, soil_moisture, temperature_change, seasonal_factor
    ]])

    # Scale input
    try:
        scaled_input = models["scaler"].transform(input_data)
        
        if st.button("Predict Disaster Risks", type="primary"):
            col1, col2, col3, col4 = st.columns(4)
            
            # Flood Prediction
            flood_risk = models["flood"].predict(scaled_input)[0]
            with col1:
                st.metric("Flood Risk", f"{flood_risk:.1f}/10")
                if flood_risk > 7:
                    st.error("High Risk")
                elif flood_risk > 4:
                    st.warning("Moderate Risk")
                else:
                    st.success("Low Risk")

            # Fire Prediction
            fire_risk = models["fire"].predict(scaled_input)[0]
            with col2:
                st.metric("Fire Risk", f"{fire_risk:.1f}/10")
                if fire_risk > 7:
                    st.error("High Risk")
                elif fire_risk > 4:
                    st.warning("Moderate Risk")
                else:
                    st.success("Low Risk")

            # Earthquake Prediction
            earthquake_risk = models["earthquake"].predict(scaled_input)[0]
            with col3:
                st.metric("Earthquake Risk", f"{earthquake_risk:.1f}/10")
                if earthquake_risk > 7:
                    st.error("High Risk")
                elif earthquake_risk > 4:
                    st.warning("Moderate Risk")
                else:
                    st.success("Low Risk")

            # Storm Prediction
            storm_risk = models["storm"].predict(scaled_input)[0]
            with col4:
                st.metric("Storm Risk", f"{storm_risk:.1f}/10")
                if storm_risk > 7:
                    st.error("High Risk")
                elif storm_risk > 4:
                    st.warning("Moderate Risk")
                else:
                    st.success("Low Risk")
            
            st.markdown("---")
            st.subheader("Detailed Analysis")
            st.json({
                "input_parameters": {
                    "location": {"lat": latitude, "lon": longitude},
                    "weather": {
                        "temp": temperature,
                        "humidity": humidity,
                        "wind": wind_speed
                    }
                },
                "raw_scores": {
                    "flood": float(flood_risk),
                    "fire": float(fire_risk),
                    "earthquake": float(earthquake_risk),
                    "storm": float(storm_risk)
                }
            })

    except Exception as e:
        st.error(f"Prediction Error: {str(e)}")
        st.info("Please ensure the input features match the model's expected format.")

else:
    st.warning("Models not found. Please ensure 'backend/models' directory contains the trained .joblib files.")
