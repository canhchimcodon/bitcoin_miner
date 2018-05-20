var mongoose = require('mongoose');

// User Schema
var productSchema = mongoose.Schema({
  product_id:{
    type: String,
    required: true
  },
  product_name:{
    type: String,
    require: true
  },
  shop_id:{
    type: String,
    require: true
  },
  category_id:{
    type: Number,
    require: true
  },
  minSell:{
    type: Number,
    default: 1
  },
  cost:{
    type: Number,
    default: 100
  },
  /*cost_array:{
    type: [Number],
      default: []
  },
  amount_match_cost_array:{
    type: [String],
      default: []
  },*/
  sizes:{
    type: [String],
    default: []
  },
  colors:{
      type: [String],
      default: []
  },
  information:{
    type: String,
    default: ''
  },
  imageUrls:{
    type:[String],
    default: []
  },
  buy_counter:{
    type: Number,
    default: 0
  },
  visit_counter:{
    type: Number,
    default: 0
  },
  cost_level:{
    type: Number,
    default: 1
  },
  discount:{
    type: Number,
    default: 0
  },
  link_product:{
    type: String,
    default: ''
  },
  link_shop:{
    type: String,
    default: ''
  },
  weight:{
    type: Number,
    default: 0.5
  },
  created_date:{
    type: Date,
    default: new Date()
  }
});

var Product = module.exports = mongoose.model('Product', productSchema);
/*Product.create({
  product_id: "558107523810",
  product_name: "Điểm bán hàng trực tiếp 2018 mùa xuân mới của phụ nữ đội mũ trùm đầu đội mũ trùm đầu đan áo len dài tay áo sọc",
  shop_id: "yinsu1688",
  category_id: 1,//1 quan ao nu, 2 quan ao nam, 3 ...
  cost: 81,
  minSell: 3,
  //cost_array: [77,81],
  //amount_match_cost_array: ["1",">=3"],
  information: "Xuất xứ Tongxiang nhà chứa Item No. 29-9707 Thương hiệu Silver Source Category Spot",
  sizes:["M","L","XL"],
  colors: ["trắng","đen","nâu","xanh dương"],
  imageUrls: ["https://cbu01.alicdn.com/img/ibank/2018/687/754/8551457786_895908389.jpg","https://cbu01.alicdn.com/img/ibank/2018/351/131/8518131153_895908389.jpg"],
  buy_counter: 0,
  visit_counter: 1,
  cost_level: 3,
  discount: 20,
  link_product: "https://detail.1688.com/offer/558107523810.html?spm=a261y.7663282.0.0.49e86ffd67eftm",
  link_shop: "https://yinsu1688.1688.com/?spm=a261y.7663282.0.0.777b6ffdJqUXtL",
});*/

//get Users
module.exports.getProducts = function(callback, limit){
  Product.find(callback).sort({cost:-1}).limit(limit);
}
//get Product by category_id
module.exports.getProductByCategory = function(category_id,limit,page,callback){
   var query ={category_id: category_id}
  Product.find(query, callback).sort({cost:-1}).skip(page*limit).limit(limit);
}

module.exports.addProduct = function(product, callback){
  //product.created_date = new Date();
  Product.create(product, callback);
}

//update User
module.exports.updateProduct = function(product, options, callback){
  var query = {product_id: product.product_id};
  var update = {
      category_id: product.category_id,
      product_id: product.product_id,
      product_name: product.product_name,
      shop_id: product.shop_id,
      category_id: product.category_id,
      cost: product.cost,
      minSell: product.minSell,
      //cost_array: product.cost_array,
      //amount_match_cost_array: product.amount_match_cost_array,
      information: product.information,
      imageUrls: product.imageUrls,
      buy_counter: product.buy_counter,
      visit_counter: product.visit_counter,
      cost_level: product.cost_level,
      discount: product.discount,
      link_product: product.link_product,
      link_shop: product.link_shop,
      weight: product.weight,
      sizes: product.sizes,
      colors: product.colors

  }
  Product.findOneAndUpdate(query, update, options, callback);
}
