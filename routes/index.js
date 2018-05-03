var express = require('express');
var router = express.Router();

var dataWeather = [];
var errors = [];

/* GET home page. */
router.get('/', (req, res) => {
  dataWeather =[];
  errors = [];
  res.render('index', { data: dataWeather, errors: errors });
});


router.post('/search', (req, res) => {

  if (req.body.search.length > 0 ) {
      dataWeather = [...dataWeather, req.body.search];
      res.render('index', { data: dataWeather, errors});
  }
  else {
      errors = [...errors, 'Le champs n\'est pas renseigné'];
      res.render('index', { errors, data: dataWeather });
      errors = [];
  }
})

router.get('/delete', (req, res) => {
    dataWeather.splice(req.query.id, 1);
    res.render('index', { data: dataWeather, errors });
})

module.exports = router;
