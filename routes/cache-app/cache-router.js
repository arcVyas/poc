var express = require('express');
var http = require('http');
var router = express.Router();
var async = require('async');
var request = require('request');

router.get('/enableCache', function(req, res, next) {
  res.render('./cache-app/cache-enabler', {data:null});
});

router.post('/enableCache', function(req, res, next) {
  var jvm = req.query.jvm
  var port = req.query.port
  var context = req.query.context
  var seedList = req.query.seedList
  var response = "Executing enableCache on "+jvm+":"+port+"; context="+ context + "; seedList="+seedList+"; ";
  console.log(response);

  async.series([
    function(callback) {
      var url = "http://"+jvm+":"+port+"/"+context+"/cache/maps/exp-env-map/remote-cache-on?op=UPDATE&value=true"
      console.log("calling url :" + url)
      request(
        {
          "url": url,
          "timeout": 10000,
          "rejectUnauthorized": false
        },
        function(err, response, body) {
          if(err) { console.log(err); callback(true); return; }
          console.log("statusCode: "+ response.statusCode)
          var response=" 1. Flag remote-cache-on set to true in exp-env-map;"
          console.log(response);
          callback(false, response);
        }
      );
    },
    function(callback) {
      if(!seedList){
        response = " 2. SeedList is empty. Assume JVM has it right;"
      }else{
        var url = "http://"+jvm+":"+port+"/"+context+"/cache/maps/exp-env-map/hzcast-cluster-seed-list?op=UPDATE&value="+seedList
        console.log("calling url :" + url)
        request(
          {
            "url": url,
            "timeout": 10000,
            "rejectUnauthorized": false
          },
          function(err, response, body) {
            if(err) { console.log(err); callback(true); return; }
            console.log("statusCode: "+ response.statusCode)
            var response = " 2. SeedList updated to "+seedList
            console.log(response);
            callback(false, response);
          }
        );
      }
    },
    function(callback) {
      var url = "http://"+jvm+":"+port+"/"+context+"/cache/admin/remote-cache/off"
      console.log("calling url :" + url)
      request(
        {
          "url": url,
          "timeout": 10000,
          "rejectUnauthorized": false,
          "method":"POST"
        },
        function(err, response, body) {
          if(err) { console.log(err); callback(true); return; }
          console.log("statusCode: "+ response.statusCode)
          var response = " 3. Cache turned off"
          console.log(response);
          callback(false, response);
        }
      );
    },
    function(callback) {
      var url = "http://"+jvm+":"+port+"/"+context+"/cache/admin/remote-cache/on"
      console.log("calling url :" + url)
      request(
        {
          "url": url,
          "timeout": 10000,
          "rejectUnauthorized": false,
          "method":"POST"
        },
        function(err, response, body) {
          if(err) { console.log(err); callback(true); return; }
          console.log("statusCode: "+ response.statusCode)
          var response = " 4. Cache turned on"
          console.log(response);
          callback(false, response);
        }
      );
    }],
    function(err, results) {
      //console.log("Combining results")
      var resp = results[0] + "<br>"+results[1] + "<br>"+ results[2] + "<br>"+ results[3];
      console.log("response: "+ res)
      res.send(resp);
    }
  );
});

module.exports = router;


