var mongoose = require('mongoose');

// User Schema
var otherAppSchema = mongoose.Schema({
appName:{
  type: String,
  required: true
},
description:{
  type: String,
  default:""
},
iconUrl:{
  type: String,
  required: true
},
appUrl:{
  type: String,
  require: true
},
descriptionAction:{
  type: String,
  default: ""
},
satoshi:{
  type: Number,
  default: 0
}
});

var OtherApp = module.exports = mongoose.model('OtherApp', otherAppSchema);
/*user.create({
deviceId:"fjdkgjfg",
bitcoin_wallet:"1HYCxi4YeXgQ271gxKrP1mcSxyW462Bc65",
platform: "Android",
shatoshi: 200,
installed_campains: 1,
coupon_code: "ACH67AGS"
});*/

//get all otherApps
module.exports.getOtherApps = function(callback, limit){
  OtherApp.find(callback).limit(limit);
}
//get User
module.exports.getOtherAppByAppName = function(appName, callback){
  var query ={appName: appName}
  OtherApp.findOne(query, callback);
}
//add User
module.exports.addOtherApp = function(otherApp, callback){
  OtherApp.create(otherApp, callback);
}

//update User
module.exports.updateOtherApp = function(otherApp, options, callback){
  var query = {appName: otherApp.appName};
  var update = {
      appName: otherApp.appName,
      description: otherApp.description,
      iconUrl: otherApp.iconUrl,
      appUrl: otherApp.appUrl,
      descriptionAction: otherApp.descriptionAction,
      satoshi: otherApp.satoshi
  }
  User.findOneAndUpdate(query, update, options, callback);
}

//delete User
module.exports.deleteOtherApp = function(appName, callback){
  var query = {appName: appName};
  User.remove(query, callback);
}











///
