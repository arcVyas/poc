var fs = require("fs");
var moment = require('moment');
var prAnalyzer= module.exports
var http = require('http');

var async = require('async');
var request = require('request');


envValidator.callUrl= function(url){
  var statusCode
  async.parallel([
    function(callback) {
      request(url, function(err, response, body) {
        if(err) { console.log(err); callback(true); return; }
        console.log("statusCode: "+ response.statusCode)
        callback(false, response.statusCode);
      });
    }],
    function(err, results) {
      console.log("Combining results")
      console.log("statusCode: "+ results[0])
      return(results[0]);
    }
  );
}


