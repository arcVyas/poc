var SSH = require('simple-ssh');
var scp = require("./scp.js")
var mySsh = module.exports
var pass = require("../../public/files/dnc/pass.js")

var scriptPart1 = 'touch reports/txt.txt && rm ./reports/* && echo "echo \\"Starting script OMG ...\\"" > grepscripts.sh && '
var scriptPart3 = 'echo "wait" >> grepscripts.sh && echo "rc=\\$?" >> grepscripts.sh && echo "echo \\"Script execution completed.... Return code : \\$rc\\" " >> grepscripts.sh && echo "exit \\$rc" >> grepscripts.sh && sh grepscripts.sh && wait && rc=\$? && exit \$rc'


mySsh.execSsh = function(server,commandList,type,callback){
  console.log('came' + server + pass.uid)
  var ssh = new SSH({
      host: server,
      user: pass.uid,
      pass: pass.pwd
  });
  console.log('ssh set')
  var scriptMissingPart = ''
  var fileList =[]
  for(var i=0;i<commandList.length;i++){
    scriptMissingPart = scriptMissingPart + 'echo "' + commandList[i] + '" >> grepscripts.sh && '
    var fileName = commandList[i].match(/a[1-9][1-9]#.*\.csv/g)
    console.log(fileName[0])
    fileList.push(fileName[0]);
  }
  console.log(scriptPart1+ scriptMissingPart + scriptPart3)
  //console.log(fileList)
  var command = scriptPart1+ scriptMissingPart + scriptPart3;
  //command = 'echo $PATH'
  ssh.exec(command, {
      out: function(stdout) {
          console.log(stdout);
      },
      exit: function(code){
        console.log(code);
        console.log("Scripts executed. Now downloading reports..")
        scp.downloadReports(server,fileList,type,callback);
      }
  }).start();
}
