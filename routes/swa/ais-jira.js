var express = require('express');
var http = require('http');
var router = express.Router();
var async = require('async');
var request = require('request');
var moment = require('moment');
var mongoUtil = require( '../../public/js/mongoutil.js' );
var ssh = require( './ssh.js' );


router.get('/',function(req, res, next) {
  res.render('./swa/ais-jira-cards', {data:null,req:req});
});


module.exports = router;
