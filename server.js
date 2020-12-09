'use strict'

const express = require('express');
const superagent = require('superagent');

const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());


app.get('/location', function(req, res){
  
    const LOCATION_API_KEY = process.env.LOCATION_API_KEY;
    const url = `https://us1.locationiq.com/v1/search.php?key=${LOCATION_API_KEY}&q=${req.query.city}&format=json`
    superagent.get(url).then(incomingLocation =>{
      const locationData = incomingLocation.body;
      const locationValue = new Location(locationData, req.query.city);
      res.send(locationValue);
    })
  
})

app.get('/weather', function(req, res){
  
    const getWeatherCondition = [];
    const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHER_API_KEY}&days=8&lon=-1223300624`
    superagent.get(url).then(incomingWeather =>{
      const weatherCondition = incomingWeather.body;
      const getWeatherCondition = new Weather(weatherCondition)
      res.send(getWeatherCondition);
    });
   
})

function Location (location, city){
  this.search_query = city;
  this.formatted_query = location[0].display_name;
  this.latitude = location[0].lat;
  this.longitude = location[0].lon;

}

function Weather(weather){
  this.forcast = weather.weather.desciption;
  this.time = weather.valid_date;
}

// Add error handling and start server

app.listen(PORT, () => console.log(`app is listening at ${PORT}`));

app.use('*', (request, response) => {
    response.status(404).send('ERROR LOADING PAGE');
  });