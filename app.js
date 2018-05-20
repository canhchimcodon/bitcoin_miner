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
Product = require('./models/product.js')
Category = require('./models/category.js')

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
app.get('/api/user/getFreeSatoshi',function(req, res){
  User.checkExist(req.query.deviceId, function(err,user){
    if(err){
      res.json({status:res.statusCode, error:err});
    }
    else{
      if(user){
        if(user.satoshi<=500000){
        //  if(user.satoshi2 >=5000){
           var lastReceiveDate = new Date(user.last_receive_satoshi_date.setTime(user.last_receive_satoshi_date.getTime() + 1 * 86400000 ));
           if(lastReceiveDate< Date.now()){
               user.last_receive_satoshi_date = Date.now();
               var receiveSatoshi = 0;
                if(user.isCouponUsed===1){
                  user.satoshi +=50000;
                  receiveSatoshi = 50000;
                }else {
                  user.satoshi +=10000;
                  receiveSatoshi = 10000;
                }
               User.updateReceiveFreeSatoshi(user,{}, function(err, user){
                 if(err){
                   res.json({status:res.statusCode, error:err});
                 }else {
                   res.json({status:res.statusCode,result:1, message:'Congratulation! You earned '+ receiveSatoshi +' Satoshi!'});
                 }
               });

           }else {
             var millis = lastReceiveDate - Date.now();
             res.json({status:res.statusCode,result:0, message:'You can get free Satoshi after ' + Math.floor(millis/1000/60/60) + ':' + Math.floor(millis/1000/60%60) + ' hours.'});
           }
          //}else {
          //  res.json({status:res.statusCode,result:0, message:'You need earn minimum 5000 Satoshi from any Bitcoin Minerals!\n\nYou earned ' + user.satoshi2 + ' Satoshi!'});
          //}
        }else {
          res.json({status:res.statusCode,result:0, message:'You just get free Satoshi when your balance less than 500.000 Satoshi!'});
        }
      }else {
        res.json({status:res.statusCode,result:0, message:'no username exist'});
      }
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
        if(user.otherApps.indexOf(req.query.otherApp) < 0){
          user.otherApps.push(req.query.otherApp);
          user.satoshi += 300;
          User.updateOtherApp(user, {} , function(err, user){
            if(err){
              res.json({status:res.statusCode, result:0, error:err});
            }
            else{
            res.json({status:res.statusCode,user});
            }
          });
        }else {
          res.json({status:res.statusCode,result:0, message:'You had earn this offers'});
        }
      }else {
        res.json({status:res.statusCode,result:0, message:'no username exist'});
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

//deal

app.get('/api/user/dialReceive', function(req, res){
  User.checkExist(req.query.deviceId, function(err, user){
    if(err){
      res.json({status:res.statusCode, error:err});
    }else {
      if(user){
        switch (user.dial_stars) {
          case 10:
            if(user.dial_last_type==='e'){
              user.dial_stars = 0;
              user.satoshi += user.dial_last_invest*25;
              user.dial_last_invest = 0;
            }
            break;
          case 1:
            user.dial_stars = 0;
            user.satoshi +=user.dial_last_invest * 0.5;
            user.dial_last_invest = 0;
            break;
          case 2:
            user.dial_stars = 0;
            user.satoshi +=user.dial_last_invest * 1.5;
            user.dial_last_invest = 0;
            break;
          case 3:
            user.dial_stars = 0;
            user.satoshi +=user.dial_last_invest * 5;
            user.dial_last_invest = 0;
            break;
          case 4:
            user.dial_stars = 0;
            user.satoshi +=user.dial_last_invest * 17;
            user.dial_last_invest = 0;
            break;
          case 5:
            user.dial_stars = 0;
            user.satoshi +=user.dial_last_invest * 60;
            user.dial_last_invest = 0;
            break;
          case 6:
            user.dial_stars = 0;
            user.satoshi += user.dial_last_invest * 200;
            user.dial_last_invest = 0;
            break;
          default:
            break;
        }
        User.updateStarsAndSatoshi(user,{},function(err,user_response){
            res.json({status:res.statusCode, result:1, satoshi:user.satoshi});
        });
      }else {
        res.json({status:res.statusCode, result:0});
      }
    }
  });
});

app.get('/api/user/dial',function(req,res){
  User.checkExist(req.query.deviceId, function(err, user){
    if(err){
      res.json({status:res.statusCode, error:err});
    }else {
      if(user){
        var random = getRandomInt(1,100);
        if(user.dial_last_invest==0 && req.query.dial_last_invest>0){
          user.dial_last_invest = req.query.dial_last_invest;
        }
        var dial_response = dial(user, res, random);
        res.json({status:res.statusCode, result:1, user, dial_response: dial_response, dial_stars : user.dial_stars, dial_last_type: user.dial_last_type});
      }else {
        res.json({status:res.statusCode, result:0});
      }
    }
  });
});

function updateUserDial(user, dial_stars, dial_last_type){
  user.dial_stars = dial_stars;
  user.dial_last_type = dial_last_type;
  if(dial_stars==0){
    user.dial_last_invest = 0;
  }
  User.updateDial(user,{},function(err,user){

  });
  return user;
}



function dial(user, res, random){

    if(user.dial_stars==0){
      user.satoshi -= user.dial_last_invest;
      User.updateSatoshi(user,{},function(err,user){
      });
      User.updateDialInvest(user,{},function(err,user){
      });
      if(random <= 1){
        updateUserDial(user, 10, "e");
        return getReturnX10();
      }else if(1<random && random <= 4){ //10% vao o 3
        var randomReturn = getRandomInt(1,5);
        //res.json({random:random});
        switch(randomReturn){
          case 1: updateUserDial(user, 3, "a"); return 18;
          case 2: updateUserDial(user, 3, "b"); return 2;
          case 3: updateUserDial(user, 3, "c"); return 13;
          case 4: updateUserDial(user, 3, "d"); return 7;
          }
        //return 3a or 3b or 3c
      }else if( 4<random && random <=10){ //10% vao o 2
        var randomReturn = getRandomInt(1,5);
        switch(randomReturn){
          case 1: updateUserDial(user, 2, "a"); return 5;
          case 2: updateUserDial(user, 2, "b"); return 11;
          case 3: updateUserDial(user, 2, "c"); return 22;
          case 4: updateUserDial(user, 2, "d"); return 16;
          }
        //return type = 2a or 2b or 2c
      }else{
      var randomReturn = getRandomInt(1,13);
        switch(randomReturn){
          case 1: updateUserDial(user, 1, "a"); return 1;
          case 2: updateUserDial(user, 1, "a"); return 10;
          case 3: updateUserDial(user, 1, "a"); return 19;
          case 4: updateUserDial(user, 1, "b"); return 3;
          case 5: updateUserDial(user, 1, "b"); return 6;
          case 6: updateUserDial(user, 1, "b"); return 20;
          case 7: updateUserDial(user, 1, "c"); return 9;
          case 8: updateUserDial(user, 1, "c"); return 14;
          case 9: updateUserDial(user, 1, "c"); return 17;
          case 10: updateUserDial(user, 1, "d"); return 8;
          case 11: updateUserDial(user, 1, "d"); return 12;
          case 12: updateUserDial(user, 1, "d"); return 21;
        }
        //return type = 1a or 1b or 1c; //70% vao o 1
      }
    }else {
      //res.json({"random":random});
      return getDealCase1234(user, random);
    }
}


function getDealCase1234(user, random){
switch(user.dial_last_type){
	case "a":
		if(user.dial_stars===1){
			if(1<random && random <=22){
				var random2 = getRandomInt(1,100);
				if(1<random2 && random2 <=5){
          updateUserDial(user, 4, "a");
					return 18; //3a
				}else if(5< random2 <=15){
          updateUserDial(user, 3, "a");
					return 5; //2a
				}else{
					var randomReturn = getRandomInt(1,4);
					switch(randomReturn){
					case 1: updateUserDial(user, 2, "a"); return 1;
					case 2: updateUserDial(user, 2, "a"); return 10;
					case 3: updateUserDial(user, 2, "a"); return 19;
					}
					//return 1a;
				}
			}else {
        updateUserDial(user, 0, "");
				return getReturnRandomNotTypeA();
			}

		}else if (user.dial_stars === 2){
			if(1<random && random <=15){
				var random2 = getRandomInt(1,100);
				if(1< random2  && random2 <=10){
          updateUserDial(user, 4, "a");
					return 5;
					//return 2a;
				}else{
				var randomReturn = getRandomInt(1,4);
					switch(randomReturn){
					case 1: updateUserDial(user, 3, "a"); return 1;
					case 2: updateUserDial(user, 3, "a"); return 10;
					case 3: updateUserDial(user, 3, "a"); return 19;
					}
					//return 1a;
				}
			}else {
        updateUserDial(user, 0, "");
			  return getReturnRandomNotTypeA();
				//return con` lai. (ko return type 3)
			}
		}else if (user.dial_stars === 3){
			if(1<random && random <=10){
			var randomReturn = getRandomInt(1,4);
					switch(randomReturn){
					case 1: updateUserDial(user, 4, "a"); return 1;
					case 2: updateUserDial(user, 4, "a"); return 10;
					case 3: updateUserDial(user, 4, "a"); return 19;
					}
				//return 1a;
			}else {
        updateUserDial(user, 0, "");
			return getReturnRandomNotTypeA();
				//return con` lai. (ko return type 3)
			}
		}else if (user.dial_stars === 4){
			if(1<random && random <=8){
			var randomReturn = getRandomInt(1,4);
					switch(randomReturn){
            case 1: updateUserDial(user, 5, "a"); return 1;
  					case 2: updateUserDial(user, 5, "a"); return 10;
  					case 3: updateUserDial(user, 5, "a"); return 19;
					}
				//return 1a;
			}else {
        updateUserDial(user, 0, "");
			return getReturnRandomNotTypeA();
				//return con` lai. (ko return type 3)
			}
		}else{
      updateUserDial(user, 0, "");
			return getReturnRandomNotTypeA();
      //return 100;
		}
		break;
	case "b":
		if(user.dial_stars===1){
			if(1<random && random <=22){
				var random2 = getRandomInt(1,100);
				if(1<random2 && random2 <=5){
          updateUserDial(user, 4, "b");
					return 2; //3a
				}else if(5< random2 && random2  <=15){
          updateUserDial(user, 3, "b");
					return 11; //2a
				}else{
					var randomReturn = getRandomInt(1,4);
					switch(randomReturn){
					case 1: updateUserDial(user, 2, "b"); return 3;
					case 2: updateUserDial(user, 2, "b"); return 6;
					case 3: updateUserDial(user, 2, "b"); return 20;
					}
					//return 1a;
				}
			}else {
        updateUserDial(user, 0, "");
				return getReturnRandomNotTypeB();
			}

		}else if (user.dial_stars === 2){
			if(1<random && random <=15){
				var random2 = getRandomInt(1,100);
				if(1< random2 && random2  <=10){
          updateUserDial(user, 4, "b");
					return 2;
					//return 2a;
				}else{
				var randomReturn = getRandomInt(1,4);
					switch(randomReturn){
            case 1: updateUserDial(user, 3, "b"); return 3;
  					case 2: updateUserDial(user, 3, "b"); return 6;
  					case 3: updateUserDial(user, 3, "b"); return 20;
					}
					//return 1a;
				}
			}else {
        updateUserDial(user, 0, "");
			return getReturnRandomNotTypeB();
				//return con` lai. (ko return type 3)
			}
		}else if (user.dial_stars === 3){
			if(1<random && random <=10){
			var randomReturn = getRandomInt(1,4);
					switch(randomReturn){
            case 1: updateUserDial(user, 4, "b"); return 3;
  					case 2: updateUserDial(user, 4, "b"); return 6;
  					case 3: updateUserDial(user, 4, "b"); return 20;
					}
				//return 1a;
			}else {
        updateUserDial(user, 0, "");
			return getReturnRandomNotTypeB();
				//return con` lai. (ko return type 3)
			}
		}else if (user.dial_stars === 4){
			if(1<random && random <=8){
			var randomReturn = getRandomInt(1,4);
					switch(randomReturn){
            case 1: updateUserDial(user, 5, "b"); return 3;
            case 2: updateUserDial(user, 5, "b"); return 6;
            case 3: updateUserDial(user, 5, "b"); return 20;
					}
				//return 1a;
			}else {
        updateUserDial(user, 0, "");
			return getReturnRandomNotTypeB();
				//return con` lai. (ko return type 3)
			}
		}else{
      updateUserDial(user, 0, "");
			return getReturnRandomNotTypeB();
		}
		break;
	case "c":
		if(user.dial_stars===1){
			if(1<random && random <=22){
				var random2 = getRandomInt(1,100);
				if(1<random2 && random2 <=5){
          updateUserDial(user, 4, "c");
					return 13; //3a
				}else if(5< random2 && random2  <=15){
          updateUserDial(user, 3, "c");
					return 22; //2a
				}else{
					var randomReturn = getRandomInt(1,4);
					switch(randomReturn){
					case 1: updateUserDial(user, 2, "c"); return 9;
					case 2: updateUserDial(user, 2, "c"); return 14;
					case 3: updateUserDial(user, 2, "c"); return 17;
					}
					//return 1a;
				}
			}else {
        updateUserDial(user, 0, "");
				return getReturnRandomNotTypeC();
			}

		}else if (user.dial_stars === 2){
			if(1<random && random <=15){
				var random2 = getRandomInt(1,100);
				if(1< random2 && random2  <=10){
          updateUserDial(user, 4, "c");
					return 22;
					//return 2a;
				}else{
				var randomReturn = getRandomInt(1,4);
					switch(randomReturn){
            case 1: updateUserDial(user, 3, "c"); return 9;
  					case 2: updateUserDial(user, 3, "c"); return 14;
  					case 3: updateUserDial(user, 3, "c"); return 17;
					}
					//return 1a;
				}
			}else {
        updateUserDial(user, 0, "");
			return getReturnRandomNotTypeC();
				//return con` lai. (ko return type 3)
			}
		}else if (user.dial_stars === 3){
			if(1<random && random <=10){
			var randomReturn = getRandomInt(1,4);
					switch(randomReturn){
            case 1: updateUserDial(user, 4, "c"); return 9;
            case 2: updateUserDial(user, 4, "c"); return 14;
            case 3: updateUserDial(user, 4, "c"); return 17;
					}
				//return 1a;
			}else {
        updateUserDial(user, 0, "");
			return getReturnRandomNotTypeC();
				//return con` lai. (ko return type 3)
			}
		}else if (user.dial_stars === 4){
			if(1<random && random <=8){
			var randomReturn = getRandomInt(1,4);
					switch(randomReturn){
            case 1: updateUserDial(user, 5, "c"); return 9;
            case 2: updateUserDial(user, 5, "c"); return 14;
            case 3: updateUserDial(user, 5, "c"); return 17;
					}
				//return 1a;
			}else {
        updateUserDial(user, 0, "");
			return getReturnRandomNotTypeC();
				//return con` lai. (ko return type 3)
			}
		}else{
      updateUserDial(user, 0, "");
			return getReturnRandomNotTypeC();
		}
		break;
	case "d":
		if(user.dial_stars===1){
			if(1<random && random <=22){
				var random2 = getRandomInt(1,100);
				if(1<random2 && random2 <=5){
          updateUserDial(user, 4, "d");
					return 7; //3a
				}else if(5< random2 && random2  <=15){
          updateUserDial(user, 3, "d");
					return 16; //2a
				}else{
					var randomReturn = getRandomInt(1,4);
					switch(randomReturn){
					case 1: updateUserDial(user, 2, "d"); return 8;
					case 2: updateUserDial(user, 2, "d"); return 12;
					case 3: updateUserDial(user, 2, "d"); return 21;
					}
					//return 1a;
				}
			}else {
        updateUserDial(user, 0, "");
				return getReturnRandomNotTypeD();
			}

		}else if (user.dial_stars === 2){
			if(1<random && random <=15){
				var random2 = getRandomInt(1,100);
				if(1< random2 && random2  <=10){
          updateUserDial(user, 4, "d");
					return 16;
					//return 2a;
				}else{
				var randomReturn = getRandomInt(1,4);
					switch(randomReturn){
					case 1: updateUserDial(user, 3, "d"); return 8;
					case 2: updateUserDial(user, 3, "d"); return 12;
					case 3: updateUserDial(user, 3, "d"); return 21;
					}
					//return 1a;
				}
			}else {
        updateUserDial(user, 0, "");
			return getReturnRandomNotTypeD();
				//return con` lai. (ko return type 3)
			}
		}else if (user.dial_stars === 3){
			if(1<random && random <=10){
			var randomReturn = getRandomInt(1,4);
					switch(randomReturn){
            case 1: updateUserDial(user, 4, "d"); return 8;
            case 2: updateUserDial(user, 4, "d"); return 12;
            case 3: updateUserDial(user, 4, "d"); return 21;
					}
				//return 1a;
			}else {
        updateUserDial(user, 0, "");
			return getReturnRandomNotTypeD();
				//return con` lai. (ko return type 3)
			}
		}else if (user.dial_stars === 4){
			if(1<random && random <=8){
			var randomReturn = getRandomInt(1,4);
					switch(randomReturn){
            case 1: updateUserDial(user, 5, "d"); return 8;
  					case 2: updateUserDial(user, 5, "d"); return 12;
  					case 3: updateUserDial(user, 5, "d"); return 21;
					}
				//return 1a;
			}else {
        updateUserDial(user, 0, "");
			return getReturnRandomNotTypeD();
				//return con` lai. (ko return type 3)
			}
		}else{
      updateUserDial(user, 0, "");
			return getReturnRandomNotTypeD();
		}
		break;
}
}

function getReturnX10(){
  var random = getRandomInt(1,3);
    if(random==1) return 4;
    else {
      return 15;
  }
}

function getReturnRandomNotTypeA(){
var randomReturn;
				do{
					randomReturn = getRandomInt(1,23);
				}while(randomReturn==18 || randomReturn==5 || randomReturn==1
					|| randomReturn==10 || randomReturn==19)
				return randomReturn;
}
// 1a = 1,10,19
// 1b = 3,6,20
// 1c = 9,14,17
// 1d = 8,12,21
// 2a = 5,
// 2b = 11
// 2c = 22,
// 2d = 16
// 3a= 18
// 3b = 2
// 3c = 13
// 3d = 7
// spelcial 4, 15
function getReturnRandomNotTypeD(){
var randomReturn;
				do{
					randomReturn = getRandomInt(1,23);
				}while(randomReturn==16 || randomReturn==7 || randomReturn==8
					|| randomReturn==12 || randomReturn==21)
				return randomReturn;
}

function getReturnRandomNotTypeB(){
var randomReturn;
				do{
					randomReturn = getRandomInt(1,23);
				}while(randomReturn==11 || randomReturn==2 || randomReturn==3
					|| randomReturn==6 || randomReturn==20)
				return randomReturn;
}

function getReturnRandomNotTypeC(){
var randomReturn;
				do{
					randomReturn = getRandomInt(1,23);
				}while(randomReturn==22 || randomReturn==13 || randomReturn==9
					|| randomReturn==14 || randomReturn==17)
				return randomReturn;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

//end deal

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

//best order
//get all
app.get('/api/products',function(req, res){
  Product.getProducts(function(err, products){
    if(err){
      res.json({status:res.statusCode, error:err});
    }
    else{
      res.json({status:res.statusCode,size:Object.keys(products).length, products});
    }
  });
});


//add
app.post('/api/product/add',function(req, res){
  Product.addProduct(req.body, function(err, product){
    if(err){
      res.json({status:res.statusCode, error:err});
    }else{
      res.json({status:res.statusCode,product});
    }
  });
});



//update
app.put('/api/product/update',function(req, res){
  Product.updateProduct(req.body, {} , function(err, product){
    if(err){
      res.json({status:res.statusCode, error:err});
    }
    else{
    res.json({status:res.statusCode,product});
    }
  });
});

// get products by category_id
app.get('/api/products/c', function(req, res){
  var category_id = req.query.category_id;
  var limit = Number(req.query.limit);
  var page = Number(req.query.page);
  Product.getProductByCategory(category_id,limit,page,function(err, products){
    if(err){
      res.json({status:res.statusCode, error:err});
    }
    else{
      res.json({status:res.statusCode,size:Object.keys(products).length, page:page, products});
    }
  });
});


//get all
app.get('/api/categories',function(req, res){
  Category.getCategories(function(err, categories){
    if(err){
      res.json({status:res.statusCode, error:err});
    }
    else{
      res.json({status:res.statusCode,size:Object.keys(categories).length, categories});
    }
  });
});


//add
app.post('/api/category/add',function(req, res){
  Category.addCategory(req.body, function(err, category){
    if(err){
      res.json({status:res.statusCode, error:err});
    }else{
      res.json({status:res.statusCode, category});
    }
  });
});



//update
app.put('/api/category/update',function(req, res){
  Category.updateCategory(req.body, {} , function(err, category){
    if(err){
      res.json({status:res.statusCode, error:err});
    }
    else{
    res.json({status:res.statusCode, category});
    }
  });
});

app.listen(3000);
console.log('Running on port 3000...');
