var express = require('express');
var http = require('http');
var router = express.Router();
var async = require('async');
var request = require('request');
var propHandler = require('../prop-handler.js')
var props = propHandler.properties()


router.get('/', function(req, res, next) {
  res.render('./anthem/anthem-jira-home', {});
});

router.get('/stories', function(req, res, next) {
    var results={}
    var stories=[]
    var filter=" AND NOT issuetype=Sub-task"

    if(req.query.all){
      filter = ""
    }

    if(!(!req.query.sprints)){
      filter = " AND sprint in (\"Sprint "+req.query.sprints+"\")"
    }

    var _jql="project in (\"TPEDO\") and \"IT Team\" in (\"Seal Team 7\")"+filter+"+order+by+sprint,status&fields=id,key,issuetype,parent,summary,status,assignee,customfield_11224,customfield_11222&maxResults=100"
    console.log("https://"+props.get('uid')+":"+props.get('pwd')+"@"+props.get('jira-host')+"/rest/api/2/search?jql="+_jql)

    async.parallel([
    function(callback) {
      request(
        {
          "url": "https://"+props.get('uid')+":"+props.get('pwd')+"@"+props.get('jira-host')+"/rest/api/2/search?jql="+_jql,
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
      jiraResponse.issues.forEach(function(issue){
        var story={}
        if(issue.fields.issuetype.subtask){
          story["key"]=issue.fields.parent.key
          story["subTaskKey"]=issue.key
          story["summary"]=" - " + issue.fields.summary
        }else{
          story["key"]=issue.key
          story["subTaskKey"]=""
          story["summary"]=issue.fields.summary
        }
        story["id"]=issue.id
        story["status"]=issue.fields.status.name
        if(!issue.fields.assignee){
          story["assignee"]=""
        }else{
          story["assignee"]=issue.fields.assignee.displayName
        }
        if(!issue.fields.customfield_11224){
          story["sprint"]=""
        }else{
          story["sprint"]= getSprintName(issue.fields.customfield_11224[0])
        }
        story["points"]=issue.fields.customfield_11222
        //console.log("point-- "+story["points"])
        if(!(!issue.fields.customfield_11222)){
          if(!pointPivot[issue.fields.assignee.displayName]){
            pointPivot[issue.fields.assignee.displayName]=issue.fields.customfield_11222
          }else{
            pointPivot[issue.fields.assignee.displayName]=pointPivot[issue.fields.assignee.displayName]+issue.fields.customfield_11222
          }
          totalPoints=totalPoints+issue.fields.customfield_11222
        }
        stories.push(story)
      })
      results["totalPoints"]=totalPoints
      results["stories"]=stories
      results["pointPivot"]=pointPivot
      res.render('./anthem/anthem-jira-app', {data:results,jiraHost:props.get('jira-host'),sprint:req.query.sprints});
    }
  );
});

function getSprintName(customField){
  var fields = customField.split(",")
  //console.log(fields)
  for(i=0;i<fields.length;i++){
    var field = fields[i]
    if(field.indexOf("name=TP&E Seal Team 7 Sprint") > -1){
      //console.log("Found Field : " + field)
      var sprint = field.split("=")[1]
      //console.log("Found Sprint : " + sprint)
      return sprint
    }
  }
  return "Sprint - "
}

module.exports = router;
