var express = require('express');
var http = require('http');
var router = express.Router();
var pocker = require('./pocker.js')

/* GET home page. */
router.get('/coupons', function(req, resp, next) {
  var options = {
    host: "localhost",
    port: 443,
    path: '/coupons',
    method: 'GET'
  };

  http.request(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log('BODY: ' + chunk);
      resp.render('./jcp/coupons', {data:JSON.parse(chunk)});
    });
  }).end();

});


module.exports = router;
