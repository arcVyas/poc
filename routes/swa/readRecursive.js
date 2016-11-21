
const rootFolder = 'C:\\vyas\\code-base\\';

var walkSync=function(dir, fileList){
  var fs = fs || require('fs'),
  files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + file).isDirectory()) {
        filelist = walkSync(dir + file + '/', filelist);
    }
    else {
      if(file.indexOf(".xml")!==-1 && file.indexOf("AOG")!==-1){
        filelist.push(dir+"/"+file);
      }
    }
  });
  return filelist;
}

function searchAlteaService(filelist){

  for(var i=0;i<filelist.length;i++){
    var fileName= filelist[i]
    var lineReader = require('readline').createInterface({
      input: require('fs').createReadStream(fileName)
    });

    lineReader.on('line', function (line) {
      var index=line.indexOf('<ais:altea-outbound-gateway')
      if(index!==-1){
        //console.log(line)
        //console.log(index)
        var textPartIneed = line.split('alteaServiceName="')[1]
        //console.log(textPartIneed)
        var textIneed = textPartIneed.substring(0,textPartIneed.indexOf('"'))
        console.log(textIneed)
      }
    });
  }
}

var filelist = walkSync(rootFolder);
//console.log(filelist);
searchAlteaService(filelist);
