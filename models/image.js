const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const imageSchema = new Schema({
  productID: { type: ObjectId, ref: 'Product' },
  link: { type: String, required: true }
});

module.exports = mongoose.model('Image', imageSchema);
