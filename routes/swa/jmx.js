var jmx = require("jmx");
var java = require('java');
java.import("javax.management.remote.JMXConnectorFactory");

console.log("starting..")
var System = java.import('java.lang.System');
System.setProperty('sun.rmi.transport.connectionTimeout', '500');
System.setProperty('sun.rmi.transport.tcp.handshakeTimeout', '500');
System.setProperty('sun.rmi.transport.tcp.responseTimeout', '500');
System.setProperty('sun.rmi.transport.tcp.readTimeout', '500');
System.setProperty("javax.rmi.ssl.client.enabledCipherSuites", "TLS_DH_anon_WITH_AES_128_CBC_SHA256,TLS_DH_anon_WITH_AES_128_CBC_SHA");
System.setProperty("javax.rmi.ssl.client.enabledProtocols", "TLSv1.2,TLSv1.1,TLSv1,SSLv3");


client = jmx.createClient({
  host: "a12qclais304", // optional
  port: 14165,
  //service: "service:jmx:rmi://a12qclais304:14168/jndi/rmi://a12qclais304:14165/jmxrmi",
  username: "x229698",
  password: "Hygt0987"
});

/*client = jmx.createClient({
});*/

client.connect();
client.on("connect", function() {
  console.log("connected")
  client.getAttribute("java.lang:type=Memory", "HeapMemoryUsage", function(data) {
    var used = data.getSync('used');
    console.log("HeapMemoryUsage used: " + used.longValue);
    // console.log(data.toString());
  });

  /*client.setAttribute("java.lang:type=Memory", "Verbose", true, function() {
    console.log("Memory verbose on"); // callback is optional
  });*/

  /*client.invoke("java.lang:type=Memory", "gc", [], function(data) {
    console.log("gc() done");
  });*/

});
