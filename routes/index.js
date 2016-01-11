var express = require('express');
var router = express.Router();
var pocker = require('./pocker.js')

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
router.get('/scheduler-app/services/SR12345/agents', function(req, res, next) {
  res.render('./search/results/agents', {data:pocker.getAgents(1)});
});
router.get('/scheduler-app/reservations/r1234', function(req, res, next) {
  //res.send ("Came in")
  res.render('./reservation/r1234', { title: 'Express' });
});
router.get('/scheduler-app/reservations/r1234c', function(req, res, next) {
  //res.send ("Came in")
  res.render('./reservation/r1234c', { title: 'Express' });
});

router.get('/api/agents', function(req,res,next){
  res.send(pocker.getAgents(1))
});


router.get('/api/reservations', function(req,res,next){
  res.send(pocker.getReservations(1))
});
router.get('/api/reservations/:id', function(req,res,next){
  var id = req.params.id
  res.send(pocker.getReservation(id))
});

router.post('/api/reservations/create', function(req,res,next){
  console.log("create..")
  var id = 1
  var agentId = req.query.agentId
  var newId = pocker.createReservation(1,agentId)
  res.redirect('/poc/api/reservations/'+newId);
});
router.post('/api/reservations/:id/confirm', function(req,res,next){
  var id = req.params.id
  pocker.updateReservation(id,"confirmed")
  res.send(200)
});
router.post('/api/reservations/:id/complete', function(req,res,next){
  var id = req.params.id
  pocker.updateReservation(id,"completed")
  res.send(200)
});

module.exports = router;
