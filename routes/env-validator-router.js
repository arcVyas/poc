var express = require('express');
var http = require('http');
var router = express.Router();
var envValidator = require('./env-validator.js')
var async = require('async');
var request = require('request');

router.get('/testJvms', function(req, res, next) {
  res.render('./env-validator/testJvms', {data:envValidator.getUrls()});
});

router.get('/convert', function(req, res, next) {
  res.send(envValidator.convertFileJson())
});

router.get('/validate', function(req, res, next) {
  res.send(envValidator.getInstanceUrls(req.query.instance))
});
router.get('/validate-all', function(req, res, next) {
  res.send(envValidator.getAllInstances())
});

router.get('/callUrl', function(req, res, next) {
  var statusCode
  async.parallel([
    function(callback) {
      request(req.query.url, {timeout: 15000}, function(err, response, body) {
        if(err) { console.log(err); callback(true); return; }
        console.log("statusCode: "+ response.statusCode)
        callback(false, response.statusCode);
      });
    }],
    function(err, results) {
      var response={}
      console.log("Combining results")
      console.log("statusCode: "+ results[0])
      if(results[0] == "200"){
        response["status"]="SUCCESS"
      }else{
        response["status"]="FAILED"
        response["statusCode"]= results[0]
      }
      res.send(response)
    }
  );
});

router.get('/validator', function(req, res, next) {
  res.render('./env-validator/validator', {data:envValidator.getAllInstances()});
});

module.exports = router;
