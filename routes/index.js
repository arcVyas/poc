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
router.get('/scheduler-app/search', function(req, res, next) {
  //res.send ("Came in")
  res.render('./search/search', { title: 'Express' });
});
router.get('/scheduler-app/services', function(req, res, next) {
  //res.send ("Came in")
  res.render('./search/results1/services', { title: 'Express' });
});
router.get('/scheduler-app/services/*/agents', function(req, res, next) {
  //res.send ("Came in")
  res.render('./search/results1/agents', { title: 'Express' });
});
module.exports = router;
