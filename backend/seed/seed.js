const mongoose = require('mongoose');
const AQIReading = require('../models/AQIReading');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongodb:27017/aqidb';

// Bengaluru areas with realistic AQI profiles
const areas = [
  { name: 'Silk Board',      state: 'Karnataka', baseAQI: 165, variance: 45 }, // heavy traffic junction
  { name: 'Marathahalli',    state: 'Karnataka', baseAQI: 145, variance: 40 },
  { name: 'Hebbal',          state: 'Karnataka', baseAQI: 130, variance: 38 },
  { name: 'Whitefield',      state: 'Karnataka', baseAQI: 120, variance: 35 },
  { name: 'Jayanagar',       state: 'Karnataka', baseAQI: 95,  variance: 30 }, // greener area
  { name: 'Koramangala',     state: 'Karnataka', baseAQI: 110, variance: 32 },
  { name: 'Yelahanka',       state: 'Karnataka', baseAQI: 85,  variance: 28 }, // outskirts, cleaner
  { name: 'BTM Layout',      state: 'Karnataka', baseAQI: 125, variance: 36 },
];

function getCategory(aqi) {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

function getDominantPollutant(pollutants) {
  const entries = Object.entries(pollutants);
  return entries.reduce((a, b) => a[1] > b[1] ? a : b)[0].toUpperCase();
}

function randBetween(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(1));
}

function generateReadings() {
  const readings = [];
  const today = new Date();

  for (const area of areas) {
    for (let d = 29; d >= 0; d--) {
      const date = new Date(today);
      date.setDate(today.getDate() - d);

      // Simulate peak hours / seasonal + random variation
      const trend = Math.sin(d / 10) * 15;
      const aqi = Math.max(20, Math.round(
        area.baseAQI + trend + (Math.random() - 0.5) * area.variance
      ));

      const pollutants = {
        pm25: randBetween(aqi * 0.3, aqi * 0.6),
        pm10: randBetween(aqi * 0.4, aqi * 0.8),
        no2:  randBetween(10, 80),
        co:   randBetween(0.5, 4.0),
        o3:   randBetween(20, 120),
        so2:  randBetween(5, 40)
      };

      readings.push({
        city: area.name,       // reusing "city" field for area name
        state: area.state,
        date,
        aqi,
        category: getCategory(aqi),
        pollutants,
        dominantPollutant: getDominantPollutant(pollutants),
        temperature: randBetween(22, 36),
        humidity: randBetween(45, 85)
      });
    }
  }
  return readings;
}

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  await AQIReading.deleteMany({});
  console.log('🗑️  Cleared existing data');

  const readings = generateReadings();
  await AQIReading.insertMany(readings);
  console.log(`🌱 Seeded ${readings.length} AQI readings (${areas.length} Bengaluru areas × 30 days)`);

  await mongoose.disconnect();
  console.log('✅ Done!');
}

seed().catch(console.error);
