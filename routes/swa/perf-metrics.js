var express = require('express');
var http = require('http');
var router = express.Router();
var async = require('async');
var request = require('request');
var moment = require('moment');

router.get('/',function(req, res, next) {
  res.render('./swa/metrics', {data:null});
});

router.get('/search',function(req, res, next) {

  var asyncTasks = [];
  var items=[1,2,3];
  var from=1477663650;
  var until=1477668216;
  var tasks=[];
  console.log(req.query.criteria)
  console.log(req.query.from)
  console.log(req.query.until)
  if(req.query.criteria!=null){
    tasks=[]
    tasks.push(req.query.criteria)
  }
  if(req.query.from!=null){
    var epoch = moment(req.query.from, "MM/DD/YYYY HH:mm a").unix();
    console.log(epoch)
    from=epoch
  }
  if(req.query.until!=null){
    var epoch = moment(req.query.until, "MM/DD/YYYY HH:mm a").unix();
    console.log(epoch)
    until=epoch
  }
  
  var table={}

  tasks.forEach(function(task){
    asyncTasks.push(function(callback){
        console.log ("Logging : " + task);
        console.log("url:"+ "http://xxx/render?target="+task+"&from="+from+"&until="+until+"&format=json")
        request(
          {
            "url": "http://xxx/render?target="+task+"&from="+from+"&until="+until+"&format=json",
            "timeout": 10000,
            "rejectUnauthorized": false
          },
          function(err, response, body) {
            if(err) { console.log(err); callback(true); return; }
            console.log("statusCode: "+ response.statusCode)
            callback(false, body);
          }
        );
    });
  });

async.parallel(asyncTasks, function(err, results) {
  results.forEach(function(result){
    var graphiteResp = JSON.parse(result)
    graphiteResp.forEach(function(dp){
        writeResult(dp);
    })
  });
  console.log("|Time|Server|Value|");
  var resp=[]
  for(var row in table){
    table[row].forEach(function(col){
    //  console.log("|"+row+"|"+col[0]+"|"+col[1]+"|");
      var rec={}
      rec["epochTime"]=row
      var d = new Date(0)
      d.setUTCSeconds(row)
      rec["time"]=moment(d).format("YYYY-MM-DD kk:mm")
      rec["server"]=col[0]
      rec["value"]=col[1]
      //console.log(rec["time"])
      resp.push(rec)
    });
  };
  //res.send(resp);
  res.render('./swa/metrics', {data:resp});
});

function writeResult(dp){
  var server = dp.target.match(/a[0-9][0-9]qclais[1-9][0-9][0-9]/g);
  console.log("Server:" + dp.target.match(/a[0-9][0-9]qclais[1-9][0-9][0-9]/g));
  dp.datapoints.forEach(function(data){
    var arr=table[data[1]];
    //console.log(arr);
    if(arr){
      arr=table[data[1]];
    }else{
      arr=[];
    }
    var srvData=[]
    srvData.push(server.toString())
    srvData.push(data[0])
    arr.push(srvData);
    table[data[1]]=arr
  })
}

});

router.get('/test', function(req,res,next){
  var d = new Date(0)
  var resp = d.setUTCSeconds(1477663650)
  res.send(moment(d).format("YYYY-MM-DD"));
})

module.exports = router;
