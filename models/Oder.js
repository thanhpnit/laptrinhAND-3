const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const orderSchema = new Schema({
  userID: { type: ObjectId, ref: 'User' },
  fullName: String,
  address: String,
  status: { type: String, default: 'Pending' },
  paymentMethod: { type: String, default: 'COD' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
