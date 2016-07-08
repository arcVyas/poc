var express = require('express');
var http = require('http');
var router = express.Router();
var async = require('async');
var request = require('request');
var propHandler = require('./prop-handler.js')
var props = propHandler.properties()

router.get('/stories', function(req, res, next) {
    var results={}
    var stories=[]
    var filter=" AND NOT issuetype=Sub-task"

    if(req.query.all){
      filter = ""
    }
    async.parallel([
    function(callback) {
      request(
        {
          "url": "https://"+props.get('uid')+":"+props.get('pwd')+"@"+props.get('jira-host')+"/rest/api/2/search?jql=sprint in ("+req.query.sprints+") and assignee in ("+props.get('team-in-jira')+")"+filter+"+order+by+sprint,status&fields=id,key,summary,status,assignee,customfield_10900,customfield_10102&maxResults=100",
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
        story["id"]=issue.id
        story["key"]=issue.key
        story["summary"]=issue.fields.summary
        story["status"]=issue.fields.status.name
        story["assignee"]=issue.fields.assignee.displayName
        story["sprint"]= getSprintName(issue.fields.customfield_10900[0])
        story["points"]=issue.fields.customfield_10102
        if(!(!issue.fields.customfield_10102)){
          if(!pointPivot[issue.fields.assignee.displayName]){
            pointPivot[issue.fields.assignee.displayName]=issue.fields.customfield_10102
          }else{
            pointPivot[issue.fields.assignee.displayName]=pointPivot[issue.fields.assignee.displayName]+issue.fields.customfield_10102
          }
          totalPoints=totalPoints+issue.fields.customfield_10102
        }
        stories.push(story)
      })
      results["totalPoints"]=totalPoints
      results["stories"]=stories
      results["pointPivot"]=pointPivot
      res.render('./jira-app/jira-app', {data:results,jiraHost:props.get('jira-host')});
    }
  );
});

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
