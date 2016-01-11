var fs = require("fs");
var moment = require('moment');
var pocker= module.exports
console.log("\n *START* \n");
var agentFile="c:/poc-files/files/agentJson.json"
var reservationFile="c:/poc-files/files/reservationJson.json"
var agentJson = require(agentFile);
var reservationJson = require(reservationFile);
/*console.log(content.agents.availableNow[0].name)
content.agents.availableNow[0].name = "Vyas Mohan"
console.log("Output Content : \n"+ JSON.stringify(content));
fs.writeFile('/Users/vyas/workspace/projects/vyas-node/poc/public/files/agentJson-1.json',JSON.stringify(content,null,4), function(err){
    if(err){console.log(err);}
});*/
console.log("\n *EXIT* \n");

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
    var agent = agentJson.filter(function(r) {
      return r.id == agentId;
    });
    agent[0].wait = agent[0].wait + 1
  }
  pocker.writeFile(agentFile,agentJson)
}
