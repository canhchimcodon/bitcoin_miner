var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.use(bodyParser.json());

/*var mongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost/bookstore";
mongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});*/

User = require('./models/user.js')
OtherApp = require('./models/other_app.js')

// Connect to mongoose
mongoose.connect('mongodb://localhost/bitcoinminer');
var db = mongoose.connection;

app.get('/',function(req, res){
  res.send('Please use /api/books or /api/genres');
});

//get all
app.get('/api/users',function(req, res){
  User.getUsers(function(err, users){
    if(err){
      res.json({status:res.statusCode, error:err});
    }
    else{
      res.json({status:res.statusCode,size:Object.keys(users).length, users});
    }
  });
});
//get by id
app.get('/api/user/getUserByDeviceId',function(req, res){
  User.getUserByDeviceId(req.query.deviceId,function(err, user){
    if(err){
      res.json({status:res.statusCode, error:err});
    }
    else{
      res.json({status:res.statusCode,user});
    }
  });
});

//add
app.post('/api/user/add',function(req, res){
  User.addUser(req.body, function(err, user){
    if(err){
      res.json({status:res.statusCode, error:err});
    }else{
      res.json({status:res.statusCode,user});
    }
  });
});



//update
app.put('/api/user/update',function(req, res){
  User.updateUser(req.body, {} , function(err, user){
    if(err){
      res.json({status:res.statusCode, error:err});
    }
    else{
    res.json({status:res.statusCode,user});
    }
  });
});

//update
app.put('/api/user/updateSatoshi',function(req, res){
  User.updateSatoshi(req.body, {} , function(err, user){
    if(err){
      res.json({status:res.statusCode, error:err});
    }
    else{
    res.json({status:res.statusCode,user});
    }
  });
});

//update
app.put('/api/user/updateBitcoinWallet',function(req, res){
  User.updateBitcoinWallet(req.body, {} , function(err, user){
    if(err){
      res.json({status:res.statusCode, error:err});
    }
    else{
    res.json({status:res.statusCode,user});
    }
  });
});

//update
app.post('/api/user/updateOtherApp',function(req, res){
  User.checkExist(req.query.deviceId, function(err, user){
    if(err){
      res.json({status:res.statusCode, error:err});
    }else {
      if(user){
        user.otherApps.push(req.query.otherapp);
        User.updateOtherApp(user, {} , function(err, user){
          if(err){
            res.json({status:res.statusCode, result:0, error:err});
          }
          else{
          res.json({status:res.statusCode,user});
          }
        });
      }else {
        res.json({status:res.statusCode,result:0});
      }
    }
  });


});

//delete
app.delete('/api/users/:_id',function(req, res){
  var id = req.params._id;
  User.deleteUser(id, function(err, user){
    if(err){
      res.json({status:res.statusCode, error:err});
    }
    else{
      res.json({status:res.statusCode,user});
    }
  });
});

//check exist
app.get('/api/users/checkUserExist',function(req, res){
  var deviceIdParam = req.query.deviceId;
  User.checkExist(deviceIdParam, function(err, user){
    if(err){
      res.json({status:res.statusCode, error:err});
    }else {
      if(user){
        res.json({status:res.statusCode,result:1});
      }else {
        res.json({status:res.statusCode,result:0});
      }
    }
  });
});

//login
app.post('/api/user/login',function(req,res){
  var username = req.body.username;
  var password = req.body.password;
  var deviceId = req.body.deviceId;

  User.login(username, function(err, user_response){
    if(err){
      res.json({status:res.statusCode, result:0, error:err});
    }else {
      if(user_response){
        if(user_response.password===password){
          if(user_response.deviceId!==deviceId){
             //update deviceId
             user_response.deviceId = deviceId;
             User.updateUser(user_response, {}, {});
          }
          res.json({status:res.statusCode, result:1, user_response});
        }else {
          res.json({status:res.statusCode, result:0, message:'Invalid password'});
        }
      }else {
        res.json({status:res.statusCode, result:0, message:'Username does not exist'});
      }
    }
  });
});

//register
app.post('/api/user/register', function(req, res){
  var userRegister = req.body;
  var coupon_code_invite = req.query.coupon_code_invite;
  //check update for exist account
  User.checkUsernameExist(userRegister.username, function(err, user){
    if(err){
      res.json({status:res.statusCode, result:0, error:err});
    }else {
      if(user){
        res.json({status:res.statusCode, result:0, message:'The username already exist!'});
      }else {
        User.checkExist(userRegister.deviceId, function(err, user){
          if(err){
            res.json({status:res.statusCode, result:0, error:err});
          }else{
            if(user){
                if(user.username==null){
                  //update
                  user.satoshi+=100000;
                  user.username = userRegister.username;
                  user.password = userRegister.password;
                  User.updateUser(user, {} , function(err, user_response){
                    res.json({status:res.statusCode, result:1, user_response});
                  });
                }else {
                    res.json({status:res.statusCode, result:0, message:'You just create only one account for one device!'});
                }
            }else {
              //create new
              //check coupon_code
              if(coupon_code_invite==null || coupon_code_invite===''){
                userRegister.satoshi+=100000;
                User.addUser(userRegister, function(err, user_response){
                  if(err){
                    res.json({status:res.statusCode, result:0, error:err});
                  }else{
                    res.json({status:res.statusCode, result:1, user_response});
                  }
                });
              }else {
                User.checkCouponCodeExist(coupon_code_invite, function(err, user){
                  if(err){
                    res.json({status:res.statusCode, result: 0, error:err});
                  }else {
                    if(user && user.isCouponUsed==0){
                      userRegister.satoshi += 110000;
                      User.addUser(userRegister, function(err, user_response){
                        if(err){
                          res.json({status:res.statusCode, result:0, error:err});
                        }else{
                          //add 10000 satoshi for invite success
                          //update isCouponUsed =1
                          user.satoshi+=10000;
                          user.isCouponUsed=1;
                          User.updateUser(user, {} , function(err, user){
                            res.json({status:res.statusCode, result:1, user_response});
                          });

                        }
                      });

                    }else {
                      res.json({status:res.statusCode, result: 0, message: 'Invalid invite code.'});
                    }
                  }
                });
              }
              //end check coupon_code
            }
          }
        });

      }
    }
  });



});

//use coupon
app.get('/api/coupon/use', function(req, res){
  var coupon_code_param = req.query.coupon_code;
  var deviceId = req.query.deviceId;
    User.useCoupon(coupon_code_param, function(err, user){
      if(err){
        res.json({status:res.statusCode, error:err});
      }else {
        if(user){
          if(deviceId===''){
            res.json({status:res.statusCode, result:0, message:'Require deviceId'});
          }else if(deviceId===user.deviceId){
            res.json({status:res.statusCode, result:0, message: 'You can\'t use this Code'});
          }else if(user.count_coupon_used>=10){
            res.json({status:res.statusCode, result:0, message: 'Coupon Code expried'});
          }
          else {
            //check user request
            User.getUserByDeviceId(deviceId,function(err, user2){
              if(err){
                res.json({status:res.statusCode, error:err});
              }else if(user2.coupons_received.indexOf(coupon_code_param) > -1){
                res.json({status:res.statusCode, result:0, message: 'you had use the Code'});
              }
              else if(user2.coupons_received.size>=10){
                res.json({status:res.statusCode, result:0, message: 'You just can receive max is 10 Codes'});
              }else if(user.coupons_received.indexOf(user2.coupon_code) > -1){
                res.json({status:res.statusCode, result:0, message: 'You and your friend had already receive Satoshi'});
              }
              else{
                user2.satoshi+=5000;
                user2.coupons_received.push(coupon_code_param);
                User.updateUserWithCoupons(user2, {} , function(err, user2){
                  if(err){
                    res.json({status:res.statusCode, error:err});
                  }else {
                    //update user coupon code
                    user.satoshi +=5000;
                    user.count_coupon_used+=1;
                    User.updateUserWithCoupons(user, {} , function(err, user){
                      if(err){
                        res.json({status:res.statusCode, error:err});
                      }
                      else {
                        res.json({status:res.statusCode,result:1, message: user});
                      }
                    });
                  }
                });
              }
            });

          }
        }else {
          res.json({status:res.statusCode,result: 'Invalid Code'});
        }

      }
    });
});

//Other app
//get all
app.get('/api/otherApps',function(req, res){
  OtherApp.getOtherApps(function(err, otherApps){
    if(err){
      res.json({status:res.statusCode, error:err});
    }
    else{
      res.json({status:res.statusCode,size:Object.keys(otherApps).length, otherApps});
    }
  });
});
//get by name
app.get('/api/otherApp/getOtherAppByName',function(req, res){
  OtherApp.getOtherAppByAppName(req.query.appName,function(err, otherApp){
    if(err){
      res.json({status:res.statusCode, error:err});
    }
    else{
      res.json({status:res.statusCode, otherApp});
    }
  });
});

//add
app.post('/api/otherApp/add',function(req, res){
  OtherApp.addOtherApp(req.body, function(err, otherApp){
    if(err){
      res.json({status:res.statusCode, error:err});
    }else{
      res.json({status:res.statusCode, otherApp});
    }
  });
});

//update
app.put('/api/otherApp/update',function(req, res){
  OtherApp.updateOtherApp(req.body, {} , function(err, otherApp){
    if(err){
      res.json({status:res.statusCode, error:err});
    }
    else{
    res.json({status:res.statusCode, otherApp});
    }
  });
});

//delete
app.delete('/api/otherApp/:appName',function(req, res){
  var id = req.params.appName;
  OtherApp.deleteOtherApp(id, function(err, otherApp){
    if(err){
      res.json({status:res.statusCode, error:err});
    }
    else{
      res.json({status:res.statusCode,otherApp});
    }
  });
});
//end other app


//app.get('/api/users')

app.listen(3000);
console.log('Running on port 3000...');
