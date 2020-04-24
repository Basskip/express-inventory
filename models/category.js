var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CategorySchema = new Schema({
  name: { type: String, requried: true, min: 3, max: 100 }
});

// Virtual for this category instance URL
CategorySchema
  .virtual('url')
  .get(function () {
    return '/category/' + this._id;
  });

module.exports = mongoose.model('Category', CategorySchema);