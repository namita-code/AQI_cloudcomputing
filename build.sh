#!/bin/bash
set -e

echo "🌬️  AQI Dashboard — Build & Deploy Script"
echo "========================================="

# Step 1: Build React frontend
echo ""
echo "📦 Step 1: Building React frontend..."
cd frontend
npm install
npm run build
cd ..
echo "✅ Frontend built → frontend/dist/"

# Step 2: Build and start Docker containers
echo ""
echo "🐳 Step 2: Building Docker containers..."
docker compose down --remove-orphans 2>/dev/null || true
docker compose build --no-cache
echo "✅ Docker images built"

# Step 3: Start services
echo ""
echo "🚀 Step 3: Starting services..."
docker compose up -d
echo "✅ Services started"

# Step 4: Wait for MongoDB to be healthy
echo ""
echo "⏳ Step 4: Waiting for MongoDB to be ready..."
sleep 8

# Step 5: Seed data
echo ""
echo "🌱 Step 5: Seeding AQI data..."
docker exec aqi-backend node seed/seed.js
echo "✅ Data seeded!"

echo ""
echo "========================================="
echo "🎉 AQI Dashboard is running!"
echo "   → http://localhost:5000"
echo "========================================="
