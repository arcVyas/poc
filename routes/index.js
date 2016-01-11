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
  res.render('./search/results/agents', {data:pocker.getAgentsSorted(1)});
});

router.get('/scheduler-app/reservations', function(req, res, next) {
  res.render('./reservation/reservations', { data: pocker.getReservations(1)});
});
router.get('/scheduler-app/reservations/:id', function(req, res, next) {
  var id = req.params.id
  res.render('./reservation/reservation', { data: pocker.getReservation(id)});
});
router.post('/scheduler-app/reservations/create', function(req,res,next){
  console.log("create..")
  var id = 1
  var agentId = req.query.agentId
  var newId = pocker.createReservation(1,agentId)
  res.send(String(newId))
});
router.post('/scheduler-app/reservations/:id/confirm', function(req,res,next){
  var id = req.params.id
  pocker.updateReservation(id,"confirmed")
  res.send(200)
});
router.get('/scheduler-app/reservations/r1234c', function(req, res, next) {
  //res.send ("Came in")
  res.render('./reservation/r1234c', { title: 'Express' });
});

router.get('/api/agents', function(req,res,next){
  res.send(pocker.getAgentsSorted(1))
});
router.post('/api/agents/:id/update', function(req,res,next){
  var id = req.params.id
  var what = req.query.what
  var wait = (req.query.wait || 48)
  pocker.updateAgentWait(id,wait)
  res.send(200)
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

router.post('/api/resetfiles', function(req,res,next){
  var token = req.query.token
  if("GTH8765-998TGDHRUN-FNU88123"==token){
    pocker.resetFiles()
    res.send(200)
  }else{
    res.send(400)
  }
});

module.exports = router;
