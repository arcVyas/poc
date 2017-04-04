

var csv = require("fast-csv")
var fs = require("fs")
var mongoUtil = require( '../../public/js/mongoutil.js' );
var moment = require('moment');
var readCsv = module.exports

var HEADER_INDICATOR = 'Time'
var headerArray=[]
const testFolder = 'C:\\vyas\\downloaded-reports';
var rowRead=0
var filesRead=0
var rowInserted=0
var expectedFiles=0
var _fileList
var _newFileList=[]

readCsv.readCSVAndLoad= function(fileList, type, callback){
  _fileList = fileList
  mongoUtil.connectToServer( function( err ) {
    fs.readdir(testFolder, function(err, files){
      files.forEach(function(file){
        if(file.indexOf('.csv')!== -1  && file.indexOf('.loaded')== -1 ){
          //console.log(file);
          if(type=='SESSION'){
            readSessionCsvAndWriteToMongo(file,callback);
          }else{
            readCsvAndWriteToMongo(file,callback);
          }
          expectedFiles++;
        }
      });
    })
  });
}

function readCsvAndWriteToMongo(fileName,callback){
  var fileNameWithoutExt = fileName.split('.csv')[0]
  var fileNameParts = fileNameWithoutExt.split('#')
  var container= fileNameParts[0];
  var env= fileNameParts[1];
  var serviceName= fileNameParts[2];
  var sString = fileNameParts[3];
  var metric = fileNameParts[4];
  var date = fileNameParts[5];
  var stTime = fileNameParts[6].replace('-',':');
  var endTime = fileNameParts[7].replace('-',':');
  var id = container+"_"+env+"_"+serviceName+"_"+sString+"_"+metric+"_"+date+"_"+stTime+"_"+endTime
  var meta={}
  meta['id']=id
  writeMetaToMongo(meta,function(){});

  var stream = fs.createReadStream(testFolder+"/"+fileName);
  rowRead=0
  rowInserted=0
  var csvStream = csv()
      .on("data", function(data){
        //console.log(data[0])
      	if(data.length>1 && data[0].indexOf("Total") == -1 && data[0].indexOf("Capturing") == -1 && data[0].indexOf("Script ran") == -1 && data[0].indexOf("Response Times") == -1){
          if(data[0].indexOf(HEADER_INDICATOR) !== -1){
            for(var i=0;i<data.length;i++){
              headerArray.push(data[i])
            }
            //console.log('Header:' + headerArray)
          }
          else{
            var row={}
            row["id"]=id
            row["date"]=moment(date).format("YYYY-MM-DD")
            row["stTime"]=stTime
            row["endTime"]=endTime
            row["container"]=container
            row["serviceName"]= serviceName
            row["sString"]=sString
            row["metric"]=metric
            for(var i=0;i<data.length;i++){
              if(headerArray[i].indexOf("Response Time") !== -1){
                row[headerArray[i]]=parseFloat(data[i])
              }else{
                row[headerArray[i]]=data[i]
              }
            }
            //console.log('row:' + JSON.stringify(row))
            rowRead++;
            //console.log("read row=" + rowRead)
            writeToMongo(row,"METRICS",callback);
          }
      	}else{
      		//console.log('ignore line:' + data);

      	}
      })
      .on("end", function(){
          fs.rename(testFolder+"/"+fileName, testFolder+"/"+fileName+".loaded")
           console.log("file loaded and renamed : " + fileName);
           filesRead++;
      });

  stream.pipe(csvStream);
}

function readSessionCsvAndWriteToMongo(fileName,callback){
  var fileNameWithoutExt = fileName.split('.csv')[0]
  var fileNameParts = fileNameWithoutExt.split('#')
  var container= fileNameParts[0];
  var env= fileNameParts[1];
  var serviceName= fileNameParts[2];
  var state = fileNameParts[3];
  var date = fileNameParts[4];
  var stTime = fileNameParts[5].replace('-',':');
  var endTime = fileNameParts[6].replace('-',':');
  var id = container+"_"+env+"_"+serviceName+"_"+state+"_"+date+"_"+stTime+"_"+endTime
  _newFileList.push(id)
  console.log("vyas:id=" + id)
  var meta={}
  meta['id']=id
  writeMetaToMongo(meta,"SESSION",function(){console.log("wrote meta");});

  var stream = fs.createReadStream(testFolder+"/"+fileName);
  rowRead=0
  rowInserted=0
  var csvStream = csv()
      .on("data", function(data){
        //console.log(data[0])
        if(data.length>1 && data[0].indexOf("Total") == -1 && data[0].indexOf("Capturing") == -1 && data[0].indexOf("Script ran") == -1 && data[0].indexOf("Transactions") == -1){
          if(data[0].indexOf('Interval') !== -1){
            for(var i=0;i<data.length;i++){
              headerArray.push(data[i])
            }
            //console.log('Header:' + headerArray)
          }
          else{
            var row={}
            row["id"]=id
            row["date"]=moment(date).format("YYYY-MM-DD")
            row["stTime"]=stTime
            row["endTime"]=endTime
            row["container"]=container
            row["serviceName"]= serviceName
            row["state"]=state
            for(var i=0;i<data.length;i++){
              if(headerArray[i].indexOf("Duration") == -1){
                if(headerArray[i].indexOf("Interval") !== -1){
                  row[headerArray[i]]=data[i].split('-')[0]
                }else{
                  row[headerArray[i]]=data[i]
                }
                
              }
            }
            //console.log('row:' + JSON.stringify(row))
            rowRead++;
            //console.log("read row=" + rowRead)
            writeToMongo(row,"SESSION",callback);
          }
        }else{
          //console.log('ignore line:' + data);

        }
      })
      .on("end", function(){
          fs.rename(testFolder+"/"+fileName, testFolder+"/"+fileName+".loaded")
           console.log("file loaded and renamed : " + fileName);
           filesRead++;
      });

  stream.pipe(csvStream);
}

function writeToMongo(doc,type,callback){
  var db = mongoUtil.getDb();
  var tableName = "ais_metrics_report_data"
  if(type=='SESSION'){
    tableName= "ais_session_data"
  }
  var collection = db.collection(tableName);
  doc["insertTime"]= moment().format('YYYY-MM-DD HH:mm:ss.SSS')
  collection.insert(doc, function(err, result) {
    //console.log("Inserted " + rowInserted + "of " + rowRead + " read")
    rowInserted++;
    if(filesRead==expectedFiles && rowRead == rowInserted){
        console.log("Done. Inserted " + rowInserted + "of " + rowRead + " read")
        mongoUtil.closeConnection(function(){console.log("Closed Mongo Connection")})
        callback(_newFileList);
    }
  });
}

function writeMetaToMongo(doc,type,callback){
  var db = mongoUtil.getDb();
  var tableName = "ais_metrics_report_meta"
  if(type=='SESSION'){
    tableName= "ais_session_data_meta"
  }
  var collection = db.collection(tableName);
  doc["insertTime"]= moment().format('YYYY-MM-DD HH:mm:ss.SSS')
  collection.insert(doc, function(err, result) {
    console.log("Done. Inserted Meta")
    callback();
  });
}
