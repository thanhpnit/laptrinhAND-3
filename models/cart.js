const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const cartSchema = new Schema({
  userID: { type: ObjectId, ref: 'User', required: true },
  productID: { type: ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1 },
  updateAt: { type: Date, default: Date.now }
});

cartSchema.index({ userID: 1, productID: 1 }, { unique: true });

module.exports = mongoose.model('Cart', cartSchema);
