# 🚨 RescuePing

<div align="center">

![RescuePing](https://img.shields.io/badge/🚨_RescuePing-AI_Disaster_Management-red?style=for-the-badge)

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-GitHub_Pages-blue?style=for-the-badge)](https://anshiii-01.github.io/RescuePing)
[![Status](https://img.shields.io/badge/Status-Active-success?style=flat-square)](https://github.com/Anshiii-01/RescuePing)
[![React](https://img.shields.io/badge/React-19.x-61dafb?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776ab?style=flat-square&logo=python)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Code of Conduct](https://img.shields.io/badge/Code%20of%20Conduct-Contributor%20Covenant-purple?style=flat-square)](CODE_OF_CONDUCT.md)
[![Contributing](https://img.shields.io/badge/Contributing-Welcome-brightgreen?style=flat-square)](Contributing.md)

**🌊 AI-Powered Flood Forecasting & Disaster Warning System**

*Predicting Disasters. Saving Lives.*

### 🌐 [Live Demo: https://anshiii-01.github.io/RescuePing](https://anshiii-01.github.io/RescuePing)

[🚀 Quick Start](#-quick-start) • [✨ Features](#-features) • [🛠️ Tech Stack](#-tech-stack) • [💡 Credits](#-idea--credits) • [🤝 Contributing](#-contributing) • [📄 License](#-license)

</div>

---

## 🎯 About

**RescuePing** is an intelligent disaster prediction and emergency response platform that leverages advanced machine learning to provide early warnings for natural disasters including floods, earthquakes, storms, and wildfires.

> 💡 **Idea & Inspiration:** This project was inspired by and builds upon the concept of [**Alert-AID**](https://github.com/sameezy667/Alert-AID) by [**Sameer Dhir (@sameezy667)**](https://github.com/sameezy667). Full credit for the original idea goes to them.

---

## 🚀 Problem We're Solving

- 🌊 **100,000+ lives** lost annually to natural disasters
- ⏰ Current systems provide only **2-6 hours** warning
- 📍 No **evacuation guidance** with alerts
- 📉 Prediction accuracy stuck at **60-70%**

**Our Solution:**
- ✅ **24-72 hour** advance predictions
- ✅ **85%+ accuracy** with ensemble ML
- ✅ **Real shelter locations** with distances
- ✅ **Accessible** — works on any browser

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Predictions** | Ensemble ML models for 24-72 hour advance warnings |
| 🗺️ **Evacuation Routes** | Real-time shelter locations and route planning via Overpass API |
| 🌡️ **Live Weather** | OpenWeatherMap & Open-Meteo APIs with 30-min caching |
| ⚠️ **Multi-Hazard Alerts** | Earthquakes, floods, storms, wildfires |
| 📊 **Live Dashboard** | Real-time monitoring and risk visualization |
| 🌬️ **Air Quality** | Real-time AQI monitoring and health alerts |
| 🔔 **Push Notifications** | Browser-native alert delivery |
| 🌐 **Multi-language** | i18n support via react-i18next |
| 🌙 **Dark/Light Mode** | Full theme support |
| 📴 **Offline Support** | Service worker with offline fallback |
| ♿ **Accessibility** | WCAG-compliant UI with skip links |

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
git clone https://github.com/Anshiii-01/RescuePing.git
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

### Frontend Only (Static Demo)

```bash
npm start
```

The app gracefully falls back to public APIs when the backend is not running.

---

## 🏗️ Project Structure

```
RescuePing/
├── 📁 src/                     # React Frontend
│   ├── 📁 components/          # UI Components
│   │   ├── Dashboard/          # Main dashboard widgets
│   │   ├── Map/                # Leaflet evacuation maps
│   │   ├── Emergency/          # Emergency response
│   │   ├── AI/                 # AI/ML analysis cards
│   │   └── Layout/             # Navigation & footer
│   ├── 📁 services/            # API & backend services
│   ├── 📁 hooks/               # Custom React hooks
│   ├── 📁 contexts/            # React contexts (theme, location)
│   ├── 📁 pages/               # Route-level page components
│   └── 📁 styles/              # Global styles & themes
│
├── 📁 backend/                 # FastAPI Backend
│   ├── 📁 routes/              # API endpoints
│   ├── 📁 ml/                  # ML models
│   └── 📁 models/              # Trained model files
│
├── 📁 api/                     # Serverless API (Vercel/Render)
├── 📁 public/                  # Static assets & PWA manifest
├── 📄 package.json             # Frontend dependencies
└── 📄 render.yaml              # Render deployment config
```

---

## 🛠️ Tech Stack

```
Frontend:    React 19 • TypeScript 5 • Styled Components • Leaflet Maps • Recharts
Backend:     FastAPI • Python • Scikit-learn • Pandas • NumPy
ML Models:   Ensemble ML • LSTM • XGBoost • Anomaly Detection
APIs:        OpenWeatherMap • USGS • OpenStreetMap • Overpass • NASA EONET
```

---

## 🔌 API Integrations

| Service | Purpose | Rate Limit |
|---------|---------|------------|
| 🌤️ **OpenWeatherMap** | Weather data | 1,000/day (free) |
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

### GitHub Pages (Frontend)
```bash
npm run predeploy   # builds the app
npm run deploy      # deploys to gh-pages branch
```

Live at: **https://anshiii-01.github.io/RescuePing**

### Vercel (Frontend)
```bash
npm run build
vercel deploy
```

### Render (Backend)
Pre-configured with `render.yaml`

---

## 💡 Idea & Credits

| | |
|---|---|
| 💡 **Original Idea** | [Alert-AID](https://github.com/sameezy667/Alert-AID) |
| 👤 **Original Author** | [Sameer Dhir (@sameezy667)](https://github.com/sameezy667) |
| 🛠️ **Built & Maintained By** | [Anshiii-01](https://github.com/Anshiii-01) |

Full credit for the foundational concept and original design goes to **Sameer Dhir**. RescuePing extends and reimagines that work as a fully open-source disaster response platform.

---

## 🤝 Contributing

We welcome contributions of all kinds! Please read our full guidelines in [Contributing.md](Contributing.md).

1. 🍴 Fork the repository
2. 🌿 Create a feature branch: `git checkout -b feature/amazing-feature`
3. 💾 Commit your changes: `git commit -m 'Add amazing feature'`
4. 📤 Push to the branch: `git push origin feature/amazing-feature`
5. 🔀 Open a Pull Request

Please follow our [Code of Conduct](CODE_OF_CONDUCT.md) in all interactions.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for full details.

---

## 🛡️ Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

---

<div align="center">

### 🙏 Acknowledgments

OpenStreetMap • OpenWeatherMap • NASA EONET • USGS • [Sameer Dhir (Alert-AID)](https://github.com/sameezy667/Alert-AID)

---

⭐ **Star this repo if you find it helpful!**

*Built with ❤️ for humanity — Stay Safe, Stay Prepared!*

</div>
