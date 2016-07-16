module.exports = {
  properties: function(){
    var PropertiesReader = require('properties-reader');
    var properties = PropertiesReader(__dirname+"/../public/files/dnc/props.properties");
    return properties
  }
}
