const mongoose = require('mongoose');

const AQIReadingSchema = new mongoose.Schema({
  city: { type: String, required: true },
  state: { type: String, required: true },
  date: { type: Date, required: true },
  aqi: { type: Number, required: true },
  category: { type: String, required: true }, // Good, Moderate, Unhealthy, etc.
  pollutants: {
    pm25: Number,  // µg/m³
    pm10: Number,
    no2: Number,
    co: Number,
    o3: Number,
    so2: Number
  },
  dominantPollutant: String,
  temperature: Number,
  humidity: Number
}, { timestamps: true });

module.exports = mongoose.model('AQIReading', AQIReadingSchema);
