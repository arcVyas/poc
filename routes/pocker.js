var fs = require("fs");
var moment = require('moment');
var pocker= module.exports

var origAgentFile=__dirname+"/../public/files/agentJson.json"
var origReservationFile=__dirname+"/../public/files/reservationJson.json"
var agentFile=__dirname+"/../../../poc-files/files/agentJson.json"
var reservationFile=__dirname+"/../../../poc-files/files/reservationJson.json"
var agentJson = require(agentFile);
var reservationJson = require(reservationFile);
console.log("\n *Start: Files Name* \n");
console.log("origAgentFile:"+origAgentFile)
console.log("origReservationFile:"+origReservationFile)
console.log("agentFile:"+agentFile)
console.log("reservationFile:"+reservationFile)
/*console.log(content.agents.availableNow[0].name)
content.agents.availableNow[0].name = "Vyas Mohan"
console.log("Output Content : \n"+ JSON.stringify(content));
fs.writeFile('/Users/vyas/workspace/projects/vyas-node/poc/public/files/agentJson-1.json',JSON.stringify(content,null,4), function(err){
    if(err){console.log(err);}
});*/

pocker.writeFile = function(file, jsonObj){
  console.log("writing file")
  fs.writeFile(file,JSON.stringify(jsonObj,null,4), function(err){
      if(err){console.log(err);}
  });
  console.log("wrote")

}

pocker.getAgents = function(serviceId){
  console.log("pulling agent details for "+ serviceId)
  //return JSON.stringify(agentJson)
  return agentJson
}
pocker.getAgentsSorted = function(serviceId){
  console.log("pulling agent details for "+ serviceId)
  var data={}
  var agents={}
  var favorites=[]
  var availableNow=[]
  var moreAgents=[]
  agentJson.forEach(function(obj){
    var more=true
    if(obj.favorite){
      favorites.push(obj)
      more=false
    }
    if(obj.wait ==0){
      availableNow.push(obj)
      more=false
    }
    if(more){
      moreAgents.push(obj)
    }
  });
  agents["favorites"]=favorites
  agents["availableNow"]=availableNow
  agents["moreAgents"]=moreAgents
  data["agents"]=agents
  return data
}
pocker.getReservations = function(customerId){
  console.log("pulling reservation details for "+ customerId)
  //return JSON.stringify(agentJson)
  return reservationJson
}
pocker.getReservation = function(id){
  console.log("pulling reservation details for "+ id)
  var reservation = reservationJson.filter(function(r) {
    return r.id == id;
  });
  return reservation[0]
}
pocker.createReservation = function(serviceId,agentId){
  console.log(serviceId + ":" + agentId)
  reservationJson = require(reservationFile);
  console.log(reservationJson)
  var agent = agentJson.filter(function(r) {
    return r.id == agentId;
  });

  console.log("found agent" + agent[0].name)

  var appointment={}
  var now = moment()
  var apptDate
  if(agent[0].wait==0){
    apptDate = now.add(5,'m')
  }else{
    apptDate = now.add(agent[0].wait,'h')
  }

  appointment["date"]=apptDate.format("MMMM Do YYYY, h a")
  appointment["status"]="draft"
  var reservation={}
  reservation["agent"]=agent[0]
  reservation["appointment"]=appointment
  reservation["id"] = reservationJson.length + 1
  console.log(reservation)
  reservationJson.push(reservation)
  console.log("updated")

  pocker.writeFile(reservationFile,reservationJson)
  return reservation["id"]
}

pocker.updateReservation = function(id,status){
  console.log(id + ":" + status)
  reservationJson = require(reservationFile);
  console.log(reservationJson)
  var reservation = reservationJson.filter(function(r) {
    return r.id == id;
  });
  console.log(reservation[0])

  console.log("found reservation" + reservation[0].appointment.status)
  reservation[0].appointment.status = status
  console.log("updated")

  pocker.writeFile(reservationFile,reservationJson)

  if(status=="confirmed"){
    var agentId = reservation[0].agent.id
    pocker.updateAgentWait(agentId)
  }
}

pocker.updateAgentWait = function(agentId,wait){
  console.log(agentId + ":" + wait)
  
  var agent = agentJson.filter(function(r) {
    return r.id == agentId;
  });
  if(agent.length>0){
    if(!wait){
      wait = agent[0].wait + 1
    }
    console.log('updating wait for agentId: '+agentId)
    agent[0].wait = wait
    pocker.writeFile(agentFile,agentJson)
  }
}

pocker.resetFiles = function(){
  agentJson = require(origAgentFile);
  reservationJson = require(origReservationFile);
  pocker.writeFile(agentFile,agentJson)
  pocker.writeFile(reservationFile,reservationJson)
}
