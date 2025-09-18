const express = require('express');
const axios = require('axios');

const router = express.Router();

// Get weather forecast
router.get('/', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ 
        message: 'Latitude and longitude are required' 
      });
    }

    const API_KEY = process.env.OPENWEATHER_API_KEY || 'demo_key';
    
    // If no API key is provided, return dummy weather data
    if (API_KEY === 'demo_key') {
      const dummyWeather = {
        current: {
          temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
          humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
          conditions: ['Sunny', 'Partly Cloudy', 'Overcast', 'Light Rain'][Math.floor(Math.random() * 4)],
          windSpeed: Math.floor(Math.random() * 10) + 5,
          icon: 'sunny'
        },
        tomorrow: {
          temperature: Math.floor(Math.random() * 15) + 20,
          humidity: Math.floor(Math.random() * 40) + 40,
          conditions: ['Sunny', 'Partly Cloudy', 'Overcast', 'Light Rain'][Math.floor(Math.random() * 4)],
          windSpeed: Math.floor(Math.random() * 10) + 5,
          icon: 'cloudy'
        },
        location: 'Demo Location'
      };
      
      return res.json(dummyWeather);
    }

    // Fetch current weather and forecast
    const [currentResponse, forecastResponse] = await Promise.all([
      axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`),
      axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
    ]);

    const current = currentResponse.data;
    const forecast = forecastResponse.data;

    // Get tomorrow's forecast (next day)
    const tomorrow = forecast.list.find(item => {
      const itemDate = new Date(item.dt * 1000);
      const tomorrowDate = new Date();
      tomorrowDate.setDate(tomorrowDate.getDate() + 1);
      return itemDate.getDate() === tomorrowDate.getDate();
    }) || forecast.list[0];

    const weatherData = {
      current: {
        temperature: Math.round(current.main.temp),
        humidity: current.main.humidity,
        conditions: current.weather[0].description,
        windSpeed: current.wind.speed,
        icon: current.weather[0].icon
      },
      tomorrow: {
        temperature: Math.round(tomorrow.main.temp),
        humidity: tomorrow.main.humidity,
        conditions: tomorrow.weather[0].description,
        windSpeed: tomorrow.wind.speed,
        icon: tomorrow.weather[0].icon
      },
      location: current.name
    };

    res.json(weatherData);
  } catch (error) {
    console.error('Weather API error:', error.message);
    res.status(500).json({ 
      message: 'Failed to fetch weather data', 
      error: error.message 
    });
  }
});

module.exports = router;