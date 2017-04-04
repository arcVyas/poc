var csv = require("fast-csv")
var fs = require("fs")

var HEADER_INDICATOR = 'Interval'
var headerArray=[]

const testFolder = './';
fs.readdir(testFolder, function(err, files){
  files.forEach(function(file){
    if(file.indexOf('.csv')!== -1){
      console.log(file);
      readCsv(file);
    }
  });
})

function readCsv(fileName){
  var stream = fs.createReadStream(fileName);
  var csvStream = csv()
      .on("data", function(data){
           //console.log(data);
           //console.log(data.length)
  	if(data.length>1){
      //console.log(data[0])
      if(data[0].indexOf(HEADER_INDICATOR) !== -1){
        for(var i=0;i<data.length;i++){
          headerArray.push(data[i])
        }
        console.log('Header:' + headerArray)
      }
      else{
        var row={}
        for(var i=0;i<data.length;i++){
          row[headerArray[i]]=data[i]
        }
        console.log('row:' + JSON.stringify(row))
      }
  	}else{
  		console.log('ignore line:' + data);
  	}
      })
      .on("end", function(){
           console.log("done");
      });
   
  stream.pipe(csvStream);
}
