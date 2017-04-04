var express = require('express');
var http = require('http');
var router = express.Router();
var async = require('async');
var request = require('request');
var moment = require('moment');
var mongoUtil = require( '../../public/js/mongoutil.js' );
var ssh = require( './ssh.js' );
var pass=require('../../public/files/dnc/pass.js')

router.get('/',function(req, res, next) {
  res.render('./swa/ais-session-data-uploader', {data:null, req: req});
});

//POST needs body-parser (Install it from npm install body-parser)
router.post('/generate-and-upload-session-data',function(req, res) {
  var switchOff=false;
  if(switchOff){
    var urlList=[]
    var anchor={}
    anchor["text"]="Sorry.. this feature is temporarily switched off until the review with stakeholders"
    anchor["url"]=""
    urlList.push(anchor);
    res.send(urlList);
  }else{
    console.log('starting...')
    var container = req.body.container
    var date = req.body.date
    var stTime= req.body.stTime
    var endTime=req.body.endTime
    var serviceName = req.body.serviceName
    var env = req.body.env
    var servers = '*ais3*'
    if(env=="MIG"){
      servers = '*ais3*'
    }
    var version = req.body.version
    var yearOfDate = date.split('-')[0]
    var monthOfDate = date.split('-')[1]
    var dayOfDate = date.split('-')[2]
    //var fileName = sString+"_"+metric+"_"+date+"_"+stTime+"_"+endTime+".csv"

    var searchStrings=[]
    var lLogPath='/SWAdata/logs/syslog/Application/Log/AIS/'
    searchStrings.push(pass.sessionReportCommand+ ' -d '+ date + ' -s ' + stTime + ' -e ' + endTime + ' -i 1 -p '+lLogPath+serviceName+'-'+version+'/'+yearOfDate+'/'+monthOfDate+'/'+dayOfDate+' -t  \\".*createSessionResponse\\" -r \\"*.SOAP.gz\\" > ./reports/'+container+'#'+env+'#'+serviceName+'#sessionsCreated'+'#'+date+'#'+stTime.replace(':','-')+'#'+endTime.replace(':','-')+'.csv &')
    searchStrings.push(pass.sessionReportCommand+ ' -d '+ date + ' -s ' + stTime + ' -e ' + endTime + ' -i 1 -p '+lLogPath+serviceName+'-'+version+'/'+yearOfDate+'/'+monthOfDate+'/'+dayOfDate+' -t  \\".*closeSessionRequest\\" -r \\"*.SOAP.gz\\" > ./reports/'+container+'#'+env+'#'+serviceName+'#sessionsClosed'+'#'+date+'#'+stTime.replace(':','-')+'#'+endTime.replace(':','-')+'.csv &')
    console.log(searchStrings)
    ssh.execSsh(container+pass.containerPart,searchStrings,"SESSION",function(fileList){
      var urlList=[]
      for(var i=0;i<fileList.length;i++){
        var fileName = fileList[i]
        fileName=fileName.replace('.csv','')
        //console.log(fileName)
        var url = '/swa/ais/sessiondata/reports/'+fileName
        //console.log(url)
        var anchor={}
        anchor["text"]=fileName
        anchor["url"]=url
        urlList.push(anchor);
      }
      res.send(urlList)
    })
  }
});

module.exports = router;
