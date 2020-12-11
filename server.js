'use strict'

const express = require('express');
const superagent = require('superagent');
const pg = require('pg'); // we are setting up pg to laod into our app
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;  // environmental variable setup to store our username and pass

const client = new pg.Client(DATABASE_URL); 
         // setting up the variable client to do the asking 
client.on('error', error => console.error(error));

app.use(cors());


app.get('/location', function(req, res){

  client.query('SELECT * FROM cities WHERE search_query=1;', [req.query.city]).then(data => {
    if(data.rows > 0){
      res.send(rows[0]);
    }else{
      const LOCATION_API_KEY = process.env.LOCATION_API_KEY;
      const url = `https://us1.locationiq.com/v1/search.php?key=${LOCATION_API_KEY}&q=${req.query.city}&format=json`;
      superagent.get(url).then(newLocation =>{
        const locationData = newLocation.body;
        const locationValue = new Location(locationData, req.query.city);
        client.query(`INSERT INTO firstTable (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4);` , 
        [req.query.city, locationValue.formatted_query, locationValue.latitude, locationValue.longitude])
        .then(() => {
          res.send(locationValue);
          
        })


    }).catch(error => console.log(error));
  };

  })

  });
  
  
app.get('/weather', function(req, res){
  
    const lon = req.query.longitude;
    const lat = req.query.latitude;
    const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHER_API_KEY}&days=8&lon=${lon}&lat=${lat}`
    
    superagent.get(url).then(weatherUpdate =>{
      
      const weatherCondition = weatherUpdate.body;
      const getWeatherCondition = weatherCondition.data.map(updatedWeather => new Weather(updatedWeather));
     res.send(getWeatherCondition);
      }).catch(error => console.log(error));
 });

 app.get('/trails', function(req, res){

  const TRAIL_API_KEY = process.env.TRAIL_API_KEY;
  const lon = req.query.longitude;
  const lat = req.query.latitude;
  const url = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=100&key=${TRAIL_API_KEY}`
  superagent.get(url).then(trialInfo =>{
    const newTrialData = trialInfo.body;
    // console.log(trialInfo);
    const updatedTrail = newTrialData.trails.map(trialInfo => new Trials(trialInfo));
    // console.log(updatedTrail);
    res.send(updatedTrail);

  }).catch(error => console.log(error));

 })

function Location (location, city){
  this.search_query = city;
  this.formatted_query = location[0].display_name;
  this.latitude = location[0].lat;
  this.longitude = location[0].lon;

}

function Weather(weather){
  this.forecast = weather.weather.description;
  this.time = weather.valid_date;
}


function Trials(hikiingPlace){

  this.name = hikiingPlace.name;
  this.location = hikiingPlace.location;
  this.lenght = hikiingPlace.length;
  this.stars = hikiingPlace.stars;
  this.votes = hikiingPlace.votes;
  this.star_votes = hikiingPlace.star_votes;
  this.summary = hikiingPlace.summary;
  this.conditions = hikiingPlace.conditionStatus;
  this.condition_date = hikiingPlace.conditionDate;
  this.condition_time =hikiingPlace.conditionDate;
}



// Add error handling and start server

app.use('*', (request, response) => {
    response.status(404).send('ERROR LOADING PAGE');

  });

  // connect the pg client to the databse
  
  client.connect().then(() =>{
  app.listen(PORT, () => console.log(`app is listening at ${PORT}`));
  }).catch(error=> console.error(error));