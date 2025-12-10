const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const categorySchema = new Schema({
  CataName: { type: String, required: true },
  description: String,
  parentID: { type: ObjectId, ref: 'Category', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
  