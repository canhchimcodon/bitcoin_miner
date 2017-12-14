var mongoose = require('mongoose');

// User Schema
var userSchema = mongoose.Schema({
  deviceId:{
    type: String,
    required: true
  },
  nickname:{
    type: String,
      default: 'Guest'
  },
  country:{
    type: String,
      default: ''
  },
  bitcoin_wallet:{
    type: String,
    default: ''
  },
  platform:{
    type: String,
    require: true,
    default: 'Android'
  },
  satoshi:{
    type:Number,
    require: true,
    default: 0
  },
  coupon_code:{
    type:String,
    default: ''
  },
  count_coupon_used:{
    type:Number,
    default: 0
  },
  coupons_received:{
    type:[String],
    default: []
  }
});

var User = module.exports = mongoose.model('User',userSchema);
/*user.create({
deviceId:"fjdkgjfg",
bitcoin_wallet:"1HYCxi4YeXgQ271gxKrP1mcSxyW462Bc65",
platform: "Android",
shatoshi: 200,
installed_campains: 1,
coupon_code: "ACH67AGS"
});*/

//get Users
module.exports.getUsers = function(callback, limit){
  User.find(callback).sort({satoshi:-1}).limit(limit);
}
//get User
module.exports.getUserByDeviceId = function(deviceId, callback){
  var query ={deviceId: deviceId}
  User.findOne(query, callback);
}
//add User
module.exports.addUser = function(user, callback){
  User.create(user, callback);
}

//update User
module.exports.updateUser = function(user, options, callback){
  var query = {deviceId: user.deviceId};
  var update = {
      deviceId: user.deviceId,
      nickname: user.nickname,
      country: user.country,
      bitcoin_wallet: user.bitcoin_wallet,
      platform: user.platform,
      satoshi: user.satoshi,
      coupon_code: user.coupon_code,
      count_coupon_used: user.count_coupon_used
    //  coupons_received: user.coupons_received
  }
  User.findOneAndUpdate(query, update, options, callback);
}

//delete User
module.exports.deleteUser = function(id, callback){
  var query = {_id: id};
  User.remove(query, callback);
}

//check exist
module.exports.checkExist = function(deviceIdParam, callback){
  var query = {deviceId: deviceIdParam};
  User.findOne(query, callback);
}

//check coupon exist
// module.exports.checkCouponExist = function(coupon_code_param, callback){
//   var query = {coupon_code: coupon_code_param};
//   User.findOne(query, callback);
// }

//user coupon_code
module.exports.useCoupon = function(coupon_code_param, callback){
  var query = {coupon_code: coupon_code_param};
  User.findOne(query, callback);
}










///
