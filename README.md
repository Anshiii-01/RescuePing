# 🚨 Rescue Ping - AI-Powered Disaster Alert System

<div align="center">

![Rescue Ping](https://img.shields.io/badge/🚨_Rescue--Ping-Disaster_Prediction_System-red?style=for-the-badge)

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-GitHub_Pages-blue?style=for-the-badge)](https://anshiii-01.github.io/rescue-ping)

[![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=flat-square)](https://github.com/Anshiii-01/rescue-ping)
[![React](https://img.shields.io/badge/React-19.x-61dafb?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776ab?style=flat-square&logo=python)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**A real-time disaster monitoring and emergency response application featuring ML-powered predictions, interactive evacuation maps, and live weather alerts.**

### 🌐 [Live Demo: https://anshiii-01.github.io/rescue-ping](https://anshiii-01.github.io/rescue-ping)

[🚀 Quick Start](#-quick-start) • [✨ Features](#-features) • [🛠️ Tech Stack](#-tech-stack)

</div>

---

## ✨ Features

### 🌍 Real-Time Monitoring
| Feature | Description |
|---------|-------------|
| 🌡️ **Live Weather** | OpenWeatherMap & Open-Meteo APIs with 30-min caching |
| 📅 **7-Day Forecast** | Accurate predictions with risk scoring |
| 🌬️ **Air Quality** | Real-time AQI monitoring and health alerts |
| ⚠️ **Multi-Hazard Alerts** | Earthquakes, floods, storms, wildfires |

### 🗺️ Interactive Maps
| Feature | Description |
|---------|-------------|
| 🛤️ **Evacuation Routes** | OpenStreetMap with Leaflet integration |
| 🏥 **Real Shelters** | Live data from Overpass API |
| 📍 **Auto Location** | Geolocation with fallback |
| 📏 **Route Planning** | Distance to 3 nearest shelters |

### 🤖 AI/ML Analysis
| Feature | Description |
|---------|-------------|
| 📊 **Risk Scoring** | Multi-factor disaster risk assessment |
| 🧠 **Ensemble Models** | Multiple ML models for accuracy |
| 🔮 **Predictive Alerts** | Early warning system |
| 📈 **Trend Analysis** | Historical pattern recognition |

---

## 🚀 Quick Start

### Prerequisites
```bash
Node.js 18+
Python 3.10+
npm or yarn
```

### Installation

```bash
# Clone the repository
git clone https://github.com/ayushap18/congenial-waddle.git
cd RescuePing

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Running the App

```bash
# Terminal 1: Start backend (port 8000)
cd backend && source venv/bin/activate
python -m uvicorn simple_backend:app --host 0.0.0.0 --port 8000

# Terminal 2: Start frontend (port 3000)
npm start
```

🌐 Open [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Project Structure

```
Rescue Ping/
├── 📁 src/                     # React Frontend
│   ├── 📁 components/          # UI Components
│   │   ├── Dashboard/          # Main dashboard widgets
│   │   ├── Map/                # Leaflet evacuation maps
│   │   ├── Emergency/          # Emergency response
│   │   └── Safety/             # Safety modules
│   ├── 📁 services/            # API services
│   ├── 📁 hooks/               # Custom hooks
│   ├── 📁 contexts/            # React contexts
│   ├── 📁 pages/               # Page components
│   └── 📁 styles/              # Global styles
│
├── 📁 backend/                 # FastAPI Backend
│   ├── 📁 routes/              # API endpoints
│   ├── 📁 ml/                  # ML models
│   └── 📁 models/              # Trained models
│
├── 📁 public/                  # Static assets
├── 📁 build/                   # Production build
└── 📄 package.json
```

---

## 🛠️ Tech Stack

<table>
<tr>
<td>

### Frontend
- ⚛️ **React 18** - UI Library
- 📘 **TypeScript** - Type Safety
- 💅 **Styled Components** - CSS-in-JS
- 🗺️ **Leaflet** - Interactive Maps
- 📊 **Recharts** - Data Viz
- 🎨 **Lucide Icons** - Icons

</td>
<td>

### Backend
- 🐍 **FastAPI** - Python API
- ⚡ **Uvicorn** - ASGI Server
- 🤖 **Scikit-learn** - ML
- 🐼 **Pandas** - Data Processing
- 📈 **NumPy** - Numerical

</td>
</tr>
</table>

---

## 🔌 API Integrations

| Service | Purpose | Rate Limit |
|---------|---------|------------|
| 🌤️ **OpenWeatherMap** | Weather data | 1000/day |
| 🌡️ **Open-Meteo** | Weather backup | Unlimited |
| 🗺️ **OpenStreetMap** | Map tiles | Unlimited |
| 🏥 **Overpass API** | Shelter locations | Unlimited |
| 🌍 **USGS** | Earthquake data | Unlimited |
| 🛰️ **NASA EONET** | Natural events | Unlimited |

---

## ⚙️ Environment Variables

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_OPENWEATHER_API_KEY=your_api_key_here
```

---

## 🚢 Deployment

### Vercel (Frontend)
```bash
npm run build
vercel deploy
```

### Render (Backend)
Pre-configured with `render.yaml`

### Docker
```bash
docker build -t rescue-ping .
docker run -p 3000:3000 rescue-ping
```

---

## 🎨 UI Animations

The app features **cinematic animations** throughout:

- 🌀 **Fade In Up** - Page elements entrance
- ✨ **Pulse Glow** - Active alerts & buttons
- 🎭 **Scale In** - Cards and popups
- 💫 **Float** - Icons and indicators
- 🌈 **Shimmer** - Loading states
- 🎪 **Bounce In** - Notifications

---

## 📱 Responsive Design

| Device | Breakpoint |
|--------|------------|
| 📱 Mobile | < 768px |
| 📱 Tablet | 768px - 1024px |
| 💻 Desktop | > 1024px |

---

## 🤝 Contributing

1. 🍴 Fork the repository
2. 🌿 Create feature branch: `git checkout -b feature/amazing`
3. 💾 Commit changes: `git commit -m 'Add amazing feature'`
4. 📤 Push to branch: `git push origin feature/amazing`
5. 🔀 Open a Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file.

---

## 👤 Author

<table>
<tr>
<td align="center">
<strong>Ayush</strong><br>
<a href="https://github.com/ayushap18">@ayushap18</a>
</td>
</tr>
</table>

---

<div align="center">

### 🙏 Acknowledgments

OpenStreetMap • OpenWeatherMap • NASA EONET • USGS

---

⭐ **Star this repo if you find it helpful!**

🚨 **Stay Safe, Stay Prepared!**

</div>
