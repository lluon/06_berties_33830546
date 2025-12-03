const express = require('express');
const request = require('request');
const router = express.Router();

module.exports = () => {
  // GET /weather - show form + current weather (London default)
  router.get('/', (req, res) => {
    const city = req.query.city || 'London';
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    request(url, (err, response, body) => {
      if (err) {
        return res.render('weather', {
          weather: null,
          error: 'Error: Could not reach weather service',
          city: city,
          shopData: req.app.locals.shopData,
          BASE_PATH: process.env.BASE_PATH
        });
      }

      let weather;
      try {
        weather = JSON.parse(body);
      } catch (e) {
        weather = null;
      }

      let message = null;
      let weatherData = null;

      if (weather && weather.main) {
        weatherData = {
          city: weather.name,
          country: weather.sys.country,
          temp: Math.round(weather.main.temp),
          description: weather.weather[0].description.charAt(0).toUpperCase() + weather.weather[0].description.slice(1),
          humidity: weather.main.humidity,
          windSpeed: weather.wind.speed,
          icon: weather.weather[0].icon
        };
      } else {
        message = weather?.message || 'City not found or no weather data available';
      }

      res.render('weather', {
        weather: weatherData,
        error: message,
        city: city,
        shopData: req.app.locals.shopData,
        BASE_PATH: process.env.BASE_PATH
      });
    });
  });

  return router;
};