# 🌬️ AQI Dashboard — India Air Quality Monitor

A full-stack data analysis application for visualizing Air Quality Index (AQI) across 6 major Indian cities.

**Stack:** React + Vite · Node.js + Express · MongoDB · Docker · AWS EC2

---

## 📊 Features

- **Live AQI Gauge** — Animated needle meter for selected city
- **30-Day Trend Chart** — Area chart with AQI history
- **City Comparison** — Bar chart comparing all 6 cities
- **Pollutant Breakdown** — Donut chart (PM2.5, PM10, NO₂, CO, O₃, SO₂)
- **Health Advisory** — Color-coded health guidance per AQI level
- **KPI Cards** — Total readings, avg AQI, best/worst city

## 🏙️ Cities Covered
Chennai · Delhi · Mumbai · Bengaluru · Hyderabad · Kolkata

---

## 🚀 Quick Start (Local)

```bash
# 1. Build React frontend
cd frontend && npm install && npm run build && cd ..

# 2. Start everything (Docker)
chmod +x build.sh && ./build.sh

# 3. Open http://localhost:5000
```

---

## 🐳 Docker Architecture

```
docker-compose.yml
├── aqi-backend   → Express API + serves React build (port 5000)
└── aqi-mongodb   → MongoDB 7.0 (internal port 27017)
```

---

## ☁️ AWS Deployment

See [AWS_DEPLOY.md](./AWS_DEPLOY.md) for full EC2 + ECR deployment guide.

---

## 📁 Project Structure

```
aqi-dashboard/
├── backend/
│   ├── models/AQIReading.js   # MongoDB schema
│   ├── routes/aqi.js          # REST API endpoints
│   ├── seed/seed.js           # Data seeder (6 cities × 30 days)
│   ├── server.js              # Express entry point
│   └── Dockerfile
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── AQIGauge.jsx       # Animated gauge meter
│       │   ├── TrendChart.jsx     # 30-day area chart
│       │   ├── CityCompareChart.jsx
│       │   ├── PollutantChart.jsx # Donut chart
│       │   ├── KPICards.jsx
│       │   └── HealthAdvisory.jsx
│       └── App.jsx
├── docker-compose.yml
├── build.sh
└── AWS_DEPLOY.md
```

---

*Cloud Computing AAT — BMS College of Engineering, Bengaluru*
