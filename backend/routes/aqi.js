const router = require('express').Router();
const AQIReading = require('../models/AQIReading');

// GET /api/aqi/cities - list all cities
router.get('/cities', async (req, res) => {
  try {
    const cities = await AQIReading.distinct('city');
    res.json(cities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/aqi/latest - latest reading per city
router.get('/latest', async (req, res) => {
  try {
    const cities = await AQIReading.distinct('city');
    const latest = await Promise.all(cities.map(async (city) => {
      return AQIReading.findOne({ city }).sort({ date: -1 });
    }));
    res.json(latest.filter(Boolean));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/aqi/trend/:city - 30-day trend for a city
router.get('/trend/:city', async (req, res) => {
  try {
    const readings = await AQIReading.find({ city: req.params.city })
      .sort({ date: 1 })
      .limit(30)
      .select('date aqi category pollutants dominantPollutant');
    res.json(readings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/aqi/compare - latest AQI for all cities (for bar chart)
router.get('/compare', async (req, res) => {
  try {
    const cities = await AQIReading.distinct('city');
    const comparison = await Promise.all(cities.map(async (city) => {
      const latest = await AQIReading.findOne({ city }).sort({ date: -1 });
      return {
        city,
        aqi: latest?.aqi,
        category: latest?.category,
        dominantPollutant: latest?.dominantPollutant
      };
    }));
    res.json(comparison.filter(r => r.aqi));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/aqi/pollutants/:city - pollutant breakdown for latest reading
router.get('/pollutants/:city', async (req, res) => {
  try {
    const reading = await AQIReading.findOne({ city: req.params.city }).sort({ date: -1 });
    if (!reading) return res.status(404).json({ error: 'City not found' });
    res.json({
      city: reading.city,
      pollutants: reading.pollutants,
      dominantPollutant: reading.dominantPollutant,
      aqi: reading.aqi,
      category: reading.category
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/aqi/stats - overall stats
router.get('/stats', async (req, res) => {
  try {
    const total = await AQIReading.countDocuments();
    const avgAQI = await AQIReading.aggregate([
      { $group: { _id: null, avg: { $avg: '$aqi' } } }
    ]);
    const worstCity = await AQIReading.aggregate([
      { $sort: { date: -1 } },
      { $group: { _id: '$city', latestAQI: { $first: '$aqi' } } },
      { $sort: { latestAQI: -1 } },
      { $limit: 1 }
    ]);
    const bestCity = await AQIReading.aggregate([
      { $sort: { date: -1 } },
      { $group: { _id: '$city', latestAQI: { $first: '$aqi' } } },
      { $sort: { latestAQI: 1 } },
      { $limit: 1 }
    ]);
    res.json({
      totalReadings: total,
      avgAQI: Math.round(avgAQI[0]?.avg || 0),
      worstCity: worstCity[0]?._id,
      bestCity: bestCity[0]?._id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
