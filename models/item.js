var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ItemSchema = new Schema({
  name: { type: String, required: true },
  cost: { type: Number, min: 0, required: true },
  description: { type: String, required: true },
  category: { type: Schema.ObjectId, ref: 'Category', required: true }
});

// Virtual for this item instance URL
ItemSchema
.virtual('url')
.get(function () {
  return '/item/' + this._id
});

module.exports = mongoose.model('Item', ItemSchema);