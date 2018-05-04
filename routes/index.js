var express = require('express');
var router = express.Router();
var request = require('request');

var apikey = 'e8fa0755bf527c81e48b2479ebeb17c8';

var dataWeather = [];
var errors = [];

/* GET home page. */
router.get('/', (req, res) => {
    dataWeather = [];
    errors = [];
    res.render('index', { data: dataWeather, errors: errors });
});


router.post('/search', (req, res) => {

  if (req.body.search.length > 0 ) {


      let url = `http://api.openweathermap.org/data/2.5/weather?q=${req.body.search},fr&units=metric&lang=fr&APPID=${apikey}`;

      request(url, (err, response, body) => {
          if(err){
              errors = [...errors, 'la ville saisie n\'existe pas'];
              res.render('index', { weather: null, errors: errors, data: dataWeather });
              errors = [];
          } else {
              let weather = JSON.parse(body);
              if (weather.main == undefined) {
                  errors = [...errors, 'Une erreur est survenue, svp veillez réessayer'];
                  res.render('index', { weather: null, errors: errors, data: dataWeather });
                  errors = [];
              } else {
                  dataWeather = [...dataWeather, {
                      name: req.body.search,
                      temp_min: weather.main.temp_min,
                      temp_max: weather.main.temp_max,
                      description: weather.weather[0].description
                  }];
                  res.render('index', { data: dataWeather, errors  });
              }
          }
      });

      // res.render('index', { data: dataWeather, errors});
  }
  else {
      errors = [...errors, 'Le champs n\'est pas renseigné'];
      res.render('index', { data: dataWeather, errors  });
      errors = [];
  }
})

router.get('/delete', (req, res) => {
    dataWeather.splice(req.query.id, 1);
    res.render('index', { data: dataWeather, errors });
})


module.exports = router;
