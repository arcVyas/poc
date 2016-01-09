var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/login', function(req, res, next) {
  res.redirect('/poc/dashboard');
});
router.get('/schedule', function(req, res, next) {
  res.render('schedule', { title: 'Express' });
});
router.get('/search/results', function(req, res, next) {
  //res.send ("Came in")
  res.render('./search/results', { title: 'Express' });
});
module.exports = router;
