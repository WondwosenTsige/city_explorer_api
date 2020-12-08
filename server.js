
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/location', function(req, res){
  try{
    const accessLocation = require('./data/location.json');
    const accessCity = req.query.city;
    const findlocation = new Location(accessLocation, accessCity);
    res.status(200).json(findlocation);
  }
  catch(error){
    console.log(error, 'not working');
  }
})

app.get('/weather', function(req, res){
  
    const getWeatherCondition = [];
    const accessWeather = require('./data/weather.json');
    accessWeather.data.forEach(weatherCondition =>{
      getWeatherCondition.push(new weatherCondition(weatherCondition))
    });
  res.send(getWeatherCondition);
})

function Location (location, city){
  this.search_query = city;
  this,formatted_query = location[0].display_name;
  this.latitude = location[0].lat;
  this.longitude = location[0].lon;

}

function Weather(weather){
  this.forcast = weather.weather.desciption;
  this.time = weather.valid_date;
}

app.listen(PORT, () => console.log(`app is listening at ${PORT}`));

// Add error handling and start server
app.use('*', (request, response) => {
    response.status(404).send('The route you are looking for has been disconnected, We hope you have a nice day');
  });