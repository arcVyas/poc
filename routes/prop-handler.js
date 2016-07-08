module.exports = {
  properties: function(){
    var PropertiesReader = require('properties-reader');
    var properties = PropertiesReader(__dirname+"/../public/files/props.properties");
    return properties
  }
}
