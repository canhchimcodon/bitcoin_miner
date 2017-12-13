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
                User.updateUser(user2, {} , function(err, user2){
                  if(err){
                    res.json({status:res.statusCode, error:err});
                  }else {
                    //update user coupon code
                    user.satoshi +=5000;
                    user.count_coupon_used+=1;
                    User.updateUser(user, {} , function(err, user){
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





app.get('/api/users')

app.listen(3000);
console.log('Running on port 3000...');
