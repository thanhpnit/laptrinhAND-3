const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const reviewSchema = new Schema({
  userID: { type: ObjectId, ref: 'User', required: true },
  productID: { type: ObjectId, ref: 'Product', required: true },
  rating: { type: Number, min: 1, max: 5 },
  description: String,
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
