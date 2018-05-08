var express = require('express');
var router = express.Router();
var request = require('request');
var mongoose = require('mongoose');

mongoose.connect('mongodb://weather-city:Dieu2vie@ds117070.mlab.com:17070/text', function(err) {
  if (!err) {
    console.log('Vous êtes connecter à votre base de données');
  } else {
    console.log(err);
  }
});

var citySchema = mongoose.Schema({
  name: String,
  temp_min: Number,
  temp_max: Number,
  icon: String,
  description: String,
  lat: Number,
  lon: Number
});

var cityModel = mongoose.model('cities', citySchema);

var errors = [];
var dataWeather = [];

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', {
    data: dataWeather,
    errors
  });
});

router.post('/search', (req, res) => {
   var apikey = 'e8fa0755bf527c81e48b2479ebeb17c8';

   if (req.body.search.length > 0) {
      let url = `http://api.openweathermap.org/data/2.5/weather?q=${req.body.search},fr&units=metric&lang=fr&APPID=${apikey}`;
      request(url, (err, response, body) => {
        if (err) {
          errors = [
            ...errors,
            'Une erreur est survenue, svp veillez réessayer'
          ];
          res.render('index', {
            errors: errors,
            data: dataWeather
          });
          errors = [];
        }
        else {
          let weather = JSON.parse(body);
          if (weather.main == undefined) {
            errors = [
              ...errors,
              'Une erreur est survenue, svp veillez réessayer'
            ];
            res.render('index', {
              errors: errors,
              data: dataWeather
            });
            errors = [];
          }
          else {
            var newCity = new cityModel({
              name: weather.name,
              temp_min: weather.main.temp_min,
              temp_max: weather.main.temp_max,
              icon: weather.weather[0].icon,
              description: weather.weather[0].description,
              lat: weather.coord.lat,
              lon: weather.coord.lon
            });
            newCity.save(
              (error, city) => {
                cityModel.find(
                  (err, cities) => {
                    res.render('index', {
                      data: cities,
                      errors
                    });
                  });
              });
          }
        }
      });
    }
    else {
       errors = [...errors, 'Le champs n\'est pas renseigné'];
       data = [];
       res.render('index', {
         data: dataWeather,
         errors
       });
       errors = [];
     }
});

router.get('/delete', (req, res) => {
  cityModel.remove(
    { _id: req.query.id},
    (error) => {
      cityModel.find(
        (err, cities) => {
          res.render('index', {
            data: cities,
            errors
          });
        });
    }
  );
});

module.exports = router;
