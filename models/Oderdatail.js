const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const orderDetailSchema = new Schema({
  orderID: { type: ObjectId, ref: 'Order' },
  productID: { type: ObjectId, ref: 'Product' },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

orderDetailSchema.index({ orderID: 1, productID: 1 }, { unique: true });

module.exports = mongoose.model('OrderDetail', orderDetailSchema);
