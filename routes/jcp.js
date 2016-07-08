var express = require('express');
var http = require('http');
var router = express.Router();
var pocker = require('./pocker.js')
var yaml = require('js-yaml');
var fs   = require('fs');
var moment = require('moment');
var doc=null;
var tzMap = {"EDT":"-0400","CDT":"-0500","MDT":"-0600","PDT":"-0700","HST":"-0900","AKDT":"-0800", "MST":"-0600"}

router.get('/bopis', function(req, res, next) {
  
  res.render('./jcp/bopis', { title: 'BOPIS POC' });
});

router.get('/bopis/cutoff-message', function(req, res, next) {
  var zip = req.query.zip
  var cutOff = req.query.cutOff
  if(cutOff==null)
    cutOff = 15;
  try {
    if(doc==null)
      doc = yaml.safeLoad(fs.readFileSync(__dirname+"/../public/timezones_to_zipcodes.yml", 'utf8'));
    //console.log(doc);
  } catch (e) {
    console.log(e);
  }
  var tz;
  if(doc.EDT.indexOf(zip) >0)
    tz = "EDT";
  else if(doc.CDT.indexOf(zip) >0)
    tz="CDT";
  else if(doc.MDT.indexOf(zip) >0)
    tz="MDT";
  else if(doc.PDT.indexOf(zip) >0)
    tz="PDT";
  else if(doc.MST.indexOf(zip) >0)
    tz="MST";
  else if(doc.HST.indexOf(zip) >0)
    tz="HST";
  else if(doc.AKDT.indexOf(zip) >0)  
    tz="AKDT";

  console.log("tz:"+ tz);
  console.log("offset:"+ tzMap[tz]);

  var now = moment().utcOffset(tzMap[tz]).format('YYYY-MM-DD HH:mm')
  console.log("now="+now);
  var hr = moment().utcOffset(tzMap[tz]).format('H')
  console.log("hr="+hr);
  if (!moment(now).isDST()){
    console.log("its not DST. so reducing one more hour");
    hr = hr-1
    console.log(" updated hr="+hr);
  }
  var message
  var timeStr
  if(cutOff < 12){
    timeStr = cutOff + " a.m."
  }else if (cutOff==12){
    timeStr = "12 p.m"
  }else if (cutOff==24){
    timeStr = "12 a.m"
  }else{
    timeStr = (cutOff-12) + " p.m."
  }

  if(hr < cutOff){
    message = "Same Day Pickup items ordered before "+timeStr+" will be available the same day"
  }
  else{
    message = "Same Day Pickup items ordered after "+timeStr+" will be available the next day"
  }
  

  res.send(message);
});

/* GET home page. */
router.get('/coupons', function(req, resp, next) {
  var options = {
    host: "ec2-52-36-163-161.us-west-2.compute.amazonaws.com",
    port: 80,
    path: '/exp-comm-rest/api/coupons',
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
