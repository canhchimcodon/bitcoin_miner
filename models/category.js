var mongoose = require('mongoose');

// User Schema
var categorySchema = mongoose.Schema({
  category_id:{
    type: Number,
    required: true
  },
  category_name:{
    type: String,
    require: true
  },
  priority:{
    type: Number,
    default: 0
  }
});

var Category = module.exports = mongoose.model('Category', categorySchema);
/*Category.create({
  category_id: "5",
  category_name: "Giày dép cao cấp",
  priority: 5
});*/

//get Users
module.exports.getCategories = function(callback, limit){
  Category.find(callback).sort({priority:1}).limit(limit);
}

module.exports.addCategory = function(category, callback){
  Category.create(category, callback);
}

//update User
module.exports.updateCategory = function(category, options, callback){
  var query = {category_id: category.category_id};
  var update = {
      category_id: category.category_id,
      category_name: category.category_name,
      priority: category.priority
  }
  Category.findOneAndUpdate(query, update, options, callback);
}
