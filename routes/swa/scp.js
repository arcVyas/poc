var client = require('scp2')
var pass = require("../../public/files/dnc/pass.js")
var scp = module.exports
var readCsv = require("./readCsv.js")
scp.downloadReports = function(server,fileList,callback){
  var executed=0
  for(var i=0; i< fileList.length; i++){
    client.scp(pass.uid+':'+pass.pwd+'@'+server+':'+pass.unixHome+fileList[i], 'c:/vyas/downloaded-reports/', function(err) {
      if(err!=null){
        console.log(err)
      }
      executed++;
      console.log("Dowloaded " + executed + " / " + fileList.length)
      if(executed>=fileList.length){
        console.log("all files are downloaded")
        console.log("loading to mongo..")
        readCsv.readCSVAndLoad(fileList,callback);
      }
    })
  }
}
