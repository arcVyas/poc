var MongoClient = require( 'mongodb' ).MongoClient;

var _db;

module.exports = {

  connectToServer: function( callback ) {
    MongoClient.connect( "mongodb://localhost:27017/recorder", function( err, db ) {
      _db = db;
      console.log("Connected to mongo.")
      return callback( err );
    } );
  },

  getDb: function() {
    return _db;
  },

  closeConnection: function (callback) {
    _db.close(callback)
  },

  insert : function (collection, doc,callback){
    var collection = _db.collection(collection);
    doc["insertTime"]= moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    collection.insert(doc, function(err, result) {
      console.log("Inserted document")
      callback(result);
    });
  }
};
