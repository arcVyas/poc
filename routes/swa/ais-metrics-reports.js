var express = require('express');
var http = require('http');
var router = express.Router();
var async = require('async');
var request = require('request');
var moment = require('moment');
var mongoUtil = require( '../../public/js/mongoutil.js' );
var ssh = require( './ssh.js' );

function searchMongo(collection, query, callback){
    var db = mongoUtil.getDb();
    //console.log(collection)
    //console.log(query)
    var collection = db.collection(collection);
    collection.find(query).toArray(function (err, result) {
      if (err) {
        //console.log(err);
      } else if (result.length) {
        //console.log('Found:', result);
      } else {
        //console.log('No document(s) found with defined "find" criteria!');
      }
      //Close connection
      db.close();
      callback(result)
    });
}
router.get('/',function(req, res, next) {
  mongoUtil.connectToServer( function( err ) {
    searchMongo("ais_metrics_report_meta",{}, function(result){
      mongoUtil.closeConnection(function(){//console.log("Connection Closed")});
      res.render('./swa/ais-metrics-reports', {data:result,req:req});
    });
  });
});
router.get('/:id',function(req, res, next) {
  mongoUtil.connectToServer( function( err ) {
    searchMongo("ais_metrics_report_meta",{id: req.params.id}, function(result){
      ////console.log(result)
      mongoUtil.closeConnection(function(){//console.log("Connection Closed")});
      res.render('./swa/ais-metrics-report', {data:result});
    });
  });
});
router.post('/:id',function(req, res, next) {

});
router.delete('/:id',function(req, res, next) {

});
router.get('/:id/data',function(req, res, next) {
  mongoUtil.connectToServer( function( err ) {
    searchMongo("ais_metrics_report_data",{id: req.params.id}, function(result){
      ////console.log(result)
      var data={}
      data["data"]=result
      mongoUtil.closeConnection(function(){//console.log("Connection Closed")});
      res.send(data);
    });
  });
});


module.exports = router;
