var fs = require("fs");
var moment = require('moment');
var envValidator= module.exports
var http = require('http');

var async = require('async');
var request = require('request');


var callCount=0

var urlsFile=__dirname+"/../public/files/urls-to-test.json"
var instancesFile=__dirname+"/../public/files/instances-to-test.json"
var urlsJson = JSON.parse(fs.readFileSync(urlsFile,'utf8'));
var instancesJson = JSON.parse(fs.readFileSync(instancesFile,'utf8'));
//console.log("\n *Start: Files Name* \n");
//console.log("urlsFile:"+urlsFile)
//console.log("instancesFile:"+instancesFile)
//console.log("urlsJson:"+JSON.stringify(urlsJson, null, 0))
//console.log("instancesJson:"+JSON.stringify(instancesJson, null, 0))


envValidator.getUrlDataForInstance = function(instanceJson){
  //console.log("Generate test urls for instance "+ instanceJson.instance)
  var urlsData=[]


  urlsJson.forEach(function(urlObj){
    var urlData={}
    var testableUrls=[]
    var urlTemplate = urlObj.url

    if(urlTemplate.indexOf("<web-lb>")>-1){
      instanceJson.webLB.forEach(function(serverAndPort){
        var urlToTest={}
        urlToTest["url"] = urlTemplate.replace("<web-lb>",serverAndPort)
        testableUrls.push(urlToTest)
      })
    }
    else if(urlTemplate.indexOf("<app-server>")>-1){
      instanceJson.appServer.forEach(function(serverAndPort){
        var urlToTest={}
        urlToTest["url"] = urlTemplate.replace("<app-server>",serverAndPort)
        testableUrls.push(urlToTest)
      })
    }
    else if(urlTemplate.indexOf("<endeca-server>")>-1){
      instanceJson.endecaServer.forEach(function(serverAndPort){
        var urlToTest={}
        urlToTest["url"] = urlTemplate.replace("<endeca-server>",serverAndPort)
        testableUrls.push(urlToTest)
      })
    }
    urlData["name"]=urlObj.name
    urlData["urls"]=testableUrls
    urlsData.push(urlData)
  });
  //console.log("urlsData : " + JSON.stringify(urlsData, null, 0))
  return urlsData
}

envValidator.getAllInstances = function(){
  //console.log("All Instances")
  var instances=[]
  instancesJson.forEach(function(instanceJson){
    //console.log("instanceJson : "+ JSON.stringify(instanceJson, null, 0))
    var instanceObj={}
    instanceObj["instance"]=instanceJson.instance
    instanceObj["webLB"]=instanceJson.webLB
    instanceObj["appServer"]=instanceJson.appServer
    instanceObj["endecaServer"]=instanceJson.endecaServer
    var urlData = envValidator.getUrlDataForInstance(instanceJson)
    instanceObj["urlData"]=urlData
    instances.push(instanceObj)
  })
  return instances
}

envValidator.getInstanceUrls = function(instance){
  //console.log("Test instance "+ instance)
  var testResults={}
  testResults["instance"]=instance
  var instanceJson = instancesJson.filter(function(instanceObj) {
    return instanceObj.instance == instance;
  })[0];
  //console.log("instanceJson : "+ JSON.stringify(instanceJson, null, 0))
  var urlData = envValidator.getUrlDataForInstance(instanceJson)
  /*urlData.forEach(function(urlDataObj){
    callCount++
    testResults[urlDataObj.name+"_results"] = envValidator.validateUrls(urlDataObj)
    console.log("Started: " + callCount)
  })*/
  return urlData
}
envValidator.validateUrls = function(urlDataObj){
  //console.log("Validating urlDataObj: "+ urlDataObj)
  callCount=0
  urlDataObj.urls.forEach(function(urlObj){
    callCount++
    envValidator.callUrl(urlObj)
  })
  //console.log("Exiting with .."+ callCount)
  return urlDataObj
}

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
