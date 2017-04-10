var express = require('express');
var http = require('http');
var router = express.Router();
var async = require('async');
var request = require('request');
var propHandler = require('../prop-handler.js')
var props = propHandler.properties()

var statusMap = {"Open":"Open/WIP",
"Closed":"Closed",
"In Progress" : "Open/WIP",
"In Analysis": "Open/WIP",
"Ready for Sign Off"  : "Ready",
"Resolved"  : "Closed",
"Ready for QA"  : "Ready",
"Ready for Dev" : "Ready",
"In QA" :"Ready"}

router.get('/', function(req, res, next) {
  res.render('./swa/swa-jira-home', {});
});

router.get('/stories', function(req, res, next) {

  var filter=""
  if(req.query.ass){
      filter = " and assignee in ("+req.query.ass+")"
    }
    if(req.query.status){
      var statusToFilter=[]
      Object.keys(statusMap).forEach(function(key){
        if(statusMap[key]==req.query.status){
          statusToFilter.push(key)
        }
      })
      filter = filter+ " and status in ("
      for(var i in statusToFilter){
        filter = filter+"\""+statusToFilter[i]+"\","
      }
      filter = filter.slice(0,-1)
      filter=filter+")"
    }

  var _jql="project in (\"Service Virtualization\") and Team in (\"Service Virtualization CoE\",\"SV Product Support\")"+filter+"+order+by+status&fields=id,key,issuetype,customfield_10006,summary,status,assignee&maxResults=100"

   getBoards("SV COE Deliverables",_jql,req,res,next) 
});

router.get('/stories/:id/peep', function(req, res, next) {
    var story={}
    var _id = req.params.id
    var _url = "https://"+props.get('uid')+":"+props.get('pwd')+"@"+props.get('jira-host')+"/rest/api/2/issue/"+_id
    console.log(_url);
    async.parallel([
    function(callback) {
      request(
        {
          "url": _url,
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
      //console.log("response from jira: "+ results[0])
      if(err) { console.log(err); callback(true); return; }
      var jiraResponse = JSON.parse(results[0])
      story["id"]=jiraResponse.id;
      story["key"]=jiraResponse.key;
      story["summary"]= jiraResponse.fields.summary
      story["desc"]=jiraResponse.fields.description
      story["acceptance"]=jiraResponse.fields.customfield_10400
      res.send(story);
    }
  );
});

router.get('/boards/:name', function(req, res, next) {
  var _jql
  var filter="";
  if(!req.query.status || req.query.status!="all"){
    var statusToFilter=[]
    Object.keys(statusMap).forEach(function(key){
      if(statusMap[key]=="Closed"){
        statusToFilter.push(key)
      }
    })
    filter = filter+ " and status not in ("
    for(var i in statusToFilter){
      filter = filter+"\""+statusToFilter[i]+"\","
    }
    filter = filter.slice(0,-1)
    filter=filter+")"
  }
  if(req.params.name == "sv-consumer-board"){
    _jql= "project = SVIRT AND Team = \"VSI Dev Team\"" +filter+"+&maxResults=500"
  }

  getBoards(req.params.name,_jql,req,res,next)
});

function getBoards(name,_jql, req, res, next) {
    var results={}
    var stories=[]

    var _url = "https://"+props.get('uid')+":"+props.get('pwd')+"@"+props.get('jira-host')+"/rest/api/2/search?jql="+_jql
    console.log(_url);
    async.parallel([
    function(callback) {
      request(
        {
          "url": _url,
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
      //console.log("response from jira: "+ results[0])
      if(err) { console.log(err); callback(true); return; }
      var jiraResponse = JSON.parse(results[0])
      var totalPoints=0
      var pointPivot={}
      var statusPivot={}
      var statusGrpPivot={}
      var resourcePivot={}
      jiraResponse.issues.forEach(function(issue){
        var story={}
        story["id"]= issue.id
        if(!issue.fields.customfield_10006){
          story["key"]=issue.key
          story["subTaskKey"]=""
          story["summary"]= issue.fields.summary
        }else{
          story["key"]=issue.fields.customfield_10006
          story["subTaskKey"]=issue.key
          story["summary"]= issue.fields.summary
        }
        story["id"]=issue.id
        story["status"]=issue.fields.status.name
        if(!issue.fields.assignee){
          story["assignee"]="Unassigned"
          story["assigneeKey"]="Unassigned"  
        }else{
          story["assignee"]=issue.fields.assignee.displayName 
          story["assigneeKey"]=issue.fields.assignee.key   
        }
        story["sprint"]= "None";//getSprintName(issue.fields.customfield_10900[0])
        story["points"]="0";//issue.fields.customfield_10102
        /*if(!(!issue.fields.customfield_10102)){
          if(!pointPivot[issue.fields.assignee.displayName]){
            pointPivot[issue.fields.assignee.displayName]=issue.fields.customfield_10102
          }else{
            pointPivot[issue.fields.assignee.displayName]=pointPivot[issue.fields.assignee.displayName]+issue.fields.customfield_10102
          }
          totalPoints=totalPoints+issue.fields.customfield_10102
        }*/
        if(!statusPivot[issue.fields.status.name]){
            statusPivot[issue.fields.status.name]=1
        }else{
            statusPivot[issue.fields.status.name]=statusPivot[issue.fields.status.name]+1
        }
        var grpStatus = statusMap[issue.fields.status.name]
        if(!grpStatus){
          grpStatus = issue.fields.status.name
        }
        if(!statusGrpPivot[grpStatus]){
            statusGrpPivot[grpStatus]=1
        }else{
            statusGrpPivot[grpStatus]=statusGrpPivot[grpStatus]+1
        }
        var resource =  story["assignee"]+"_"+story["assigneeKey"]+"_"+grpStatus
        if(!resourcePivot[resource]){
            resourcePivot[resource]=1
        }else{
            resourcePivot[resource]=resourcePivot[resource]+1
        }
        stories.push(story)
      })
      results["boardName"]= name
      results["totalPoints"]=totalPoints
      results["stories"]=stories
      results["pointPivot"]=pointPivot
      results["statusPivot"]=statusPivot
      results["statusGrpPivot"]=statusGrpPivot
      results["resourcePivot"]=resourcePivot
      res.render('./swa/swa-jira-app', {data:results,jiraHost:props.get('jira-host')});
    }
  );
}

function getSprintName(customField){
  var fields = customField.split(",")
  //console.log(fields)
  for(i=0;i<fields.length;i++){
  	var field = fields[i]
  	if(field.indexOf("name=Sprint") > -1){
    	//console.log("Found Field : " + field)
      var sprint = field.split("=")[1]
      //console.log("Found Sprint : " + sprint)
      return sprint
    }
  }
  return "Sprint - "
}

module.exports = router;
