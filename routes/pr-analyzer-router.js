var express = require('express');
var http = require('http');
var router = express.Router();
var async = require('async');
var request = require('request');
var propHandler = require('./prop-handler.js')
var props = propHandler.properties()

router.get('/pull-requests', function(req, res, next) {
  var prList=[]
  var skipFocusList=false
  if(req.query.showAll){
    skipFocusList=true
  }
  var focusList = props.get('team-in-stash')
  if(req.query.q == null){
    req.query.prList.split(",").forEach(function(pr){
      var prDetails={}
      prDetails["id"]=pr.id
      prDetails["title"]=""
      prList.push(prDetails)
    })
    //console.log(prList)

    res.render('./pr-analyzer/prAnalyzer', {data:prList,stashHost:props.get('stash-host')});
  }else{
    console.log("q="+req.query.q)
    async.parallel([
    function(callback) {
      request(
        {
          "url": "https://"+props.get('uid')+":"+props.get('pwd')+"@"+props.get('stash-host')+"/rest/api/1.0/projects/ECOMM/repos/expcommerce/pull-requests/?"+req.query.q+"&order=NEWEST&limit=100",
          "timeout": 10000,
          "rejectUnauthorized": false
        },
        function(err, response, body) {
          if(err) { console.log(err); callback(true); return; }
          console.log("statusCode: "+ response.statusCode)
          //console.log("data: "+ body)
          callback(false, body);
        }
      );
    }],
    function(err, results) {
      //console.log("Combining results")
      //console.log("response from stash: "+ results[0])
      var stashResponse = JSON.parse(results[0])
      stashResponse.values.forEach(function(pr){
        if(skipFocusList || focusList.indexOf(pr.author.user.name) > -1){
          var prDetails={}
          prDetails["id"]=pr.id
          prDetails["title"]=pr.title
          prDetails["author"]=pr.author.user.displayName
          prDetails["state"]=pr.state
          prDetails["reviewStatus"]= getReviewStatus(pr)
          prDetails["createdDate"]=new Date(pr.createdDate)
          prDetails["updatedDate"]=new Date(pr.updatedDate)
          if(pr.closed){
            prDetails["timeElapsed"]=dateDiff(prDetails["createdDate"],prDetails["updatedDate"])
          }else{
            prDetails["timeElapsed"]=dateDiff(prDetails["createdDate"], new Date().getTime())
          }
          prList.push(prDetails)
        }
      })
      res.render('./pr-analyzer/prAnalyzer', {data:prList,stashHost:props.get('stash-host')});
    }
  );
  }
});

function getReviewStatus(pr){
  var reviewStatusArr=[]
  pr.reviewers.forEach(function(reviewer){
    var reviewStatus={}
    reviewStatus["reviewer"] = reviewer.user.name
    if(reviewer.approved)
      reviewStatus["reviewStatus"]= "done"
    else
      reviewStatus["reviewStatus"]= "pending"
    reviewStatusArr.push(reviewStatus)
  })
  return reviewStatusArr
}

router.get('/pull-requests/:id', function(req, res, next) {
  var statusCode
  var internalFlag = req.query.internal
  async.parallel([
    function(callback) {
      request(
        {
          "url": "https://"+props.get('uid')+":"+props.get('pwd')+"@"+props.get('stash-host')+"/rest/api/1.0/projects/ECOMM/repos/expcommerce/pull-requests/"+req.params.id+"/activities",
          "timeout": 10000,
          "rejectUnauthorized": false
        },
        function(err, response, body) {
          if(err) { console.log(err); callback(true); return; }
          console.log("PR statusCode: "+ response.statusCode)
          //console.log("data: "+ body)
          callback(false, body);
        }
      );
    }],
    function(err, results) {
      var response
      //console.log("Combining results")
      //console.log("response: "+ results[0])
      if(results[0]==null){
        return null
      }else{
        response = getActivity(results[0])
        res.setHeader('timeElapsed', response["timeElapsedInMillis"].toFixed(2));
        res.render('./pr-analyzer/prAnalyzer-pr', {data:response,internal:internalFlag});
      }

    }
  );
});

function getActivity(result){
  var response ={}
  var activityArr = []
  var dataFromStash = JSON.parse(result)
  dataFromStash.values.forEach(function(value){
    var activity={}
    activity["epochDate"] = value.createdDate
    activity["date"] = new Date(value.createdDate)
    activity["action"] = value.action
    activity["user"] = value.user.displayName
    activity["id"] = value.id
    if(activity["action"]=="COMMENTED"){
      activity["comments"] = value.comment.text
    }else{
      activity["comments"] = ""
    }
    activityArr.push(activity)
  })

  var lastTime=0
  var startTime=0
  var latestActivity
  var latestStatus
  for (var i = activityArr.length - 1; i >= 0; i--) {
    var activity = activityArr[i]
    var timeTaken = 0
    var timeTakenFromStart=0
    var timeTakenStr=""
    var timeTakenFromStartStr=""
    if(lastTime > 0){
      timeTaken = (activity["epochDate"] - lastTime)
      timeTakenFromStart = (activity["epochDate"] - startTime)
      activity["timeTakenInMillis"]=timeTaken
      activity["timeTakenInMillisFromStart"]=timeTakenFromStart
      activity["timeTaken"]=dateDiff(lastTime, activity["epochDate"])
      activity["timeTakenFromStart"]=dateDiff(startTime, activity["epochDate"])
      lastTime = activity["epochDate"]
    }else{
      if(activityArr.length==1){
        var currentTime = new Date().getTime()
        activity["timeTakenInMillis"]= (currentTime - activity["epochDate"])
        activity["timeTaken"]=dateDiff(activity["epochDate"], currentTime)
        activity["timeTakenInMillisFromStart"]=activity["timeTakenInMillis"]
        activity["timeTakenFromStart"]=activity["timeTaken"]
      }else{
        activity["timeTakenInMillis"]=0
        activity["timeTaken"]=""
        activity["timeTakenInMillisFromStart"]=0
        activity["timeTakenFromStart"]=""
        startTime = activity["epochDate"]
        lastTime = activity["epochDate"]
      }
    }
    if(activity["action"]=="MERGED" || activity["action"]=="DECLINED" || activity["action"]=="OPENED" || activity["action"]=="RESCOPED"){
      response["latestStatus"]=activity["action"]
    }
    latestActivity=activity
  }
  response["timeElapsed"]=latestActivity["timeTakenFromStart"]
  response["timeElapsedInMillis"]=latestActivity["timeTakenInMillisFromStart"]
  response["activity"] = activityArr
  response["anyId"]=latestActivity["id"]
  return response
}

function dateDiff(date1_ms, date2_ms){
  // Calculate the difference in milliseconds
  var difference_ms = date2_ms - date1_ms;
  //take out milliseconds
  difference_ms = difference_ms/1000;
  var seconds = Math.floor(difference_ms % 60);
  difference_ms = difference_ms/60;
  var minutes = Math.floor(difference_ms % 60);
  difference_ms = difference_ms/60;
  var hours = Math.floor(difference_ms % 24);
  var days = Math.floor(difference_ms/24);
  var returnText
  if(days>0)
    returnText = days + ' days, ' + hours + ' hours, ' + minutes + ' minutes, and ' + seconds + ' seconds';
  else if(hours>0)
    returnText = hours + ' hours, ' + minutes + ' minutes, and ' + seconds + ' seconds';
  else if(minutes>0)
    returnText = minutes + ' minutes, and ' + seconds + ' seconds';
  else if(seconds>0)
    returnText = seconds + ' seconds';
  return returnText
}

module.exports = router;
